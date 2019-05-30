import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';
import {faEye} from "@fortawesome/free-solid-svg-icons";
var StellarSdk = require('stellar-sdk');

const isValidSecretKey = input => {
    try {
        StellarSdk.Keypair.fromSecret(input);
        return true;
    } catch (e) {
        // console.error(e);
        return false;
    }
};

class Trust extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.showPlacholder = this.showPlacholder.bind(this);
        this.showPass = this.showPass.bind(this);
        this.hiddenPass = this.hiddenPass.bind(this);
        this.showXdr = this.showXdr.bind(this);
        this.state = {
            load: false,
            inValidSecretKey: false,
            key: 0,
        }
    }

    componentWillMount() {
        if (!this.Auth.loggedIn()) {
            window.location.replace('/Components/Login');
        }
        const urlPublic = this.Auth.getDomain() + '/user/account';
        const headersPublic = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configPublic = { headers: headersPublic };
        return axios.get(urlPublic, configPublic)
            .then(response => {
                this.assetAmount(response.data[0].public_key);
            });
    }

    assetAmount(public_key) {
        const url = 'https://horizon-testnet.stellar.org/accounts/' + public_key;
        return axios.get(url)
            .then(res =>{
                this.setState({
                    entry: res.data.subentry_count,
                });
                let trustFlag = false;
                res.data.balances.map(elem =>{
                    if(elem.asset_code == 'XIR')
                    {
                        trustFlag = true;
                    }
                });
                if (trustFlag)
                {
                    window.location.replace('/Components/Dashboard');
                }
            });
    }

    showPass(e){
        e.preventDefault();
        document.getElementById('showOrHidden').setAttribute("type", "text");
    }

    hiddenPass(e){
        e.preventDefault();
        document.getElementById('showOrHidden').setAttribute("type", "password");
    }

    showPlacholder(e)
    {
        e.preventDefault();
        e.currentTarget.children[0].children[0].setAttribute("class", "enable text-left text-light placholder pr-2 pl-2");
        e.currentTarget.children[0].children[1].removeAttribute("placeholder");
    }

    componentDidMount() {
        const urlPublic = this.Auth.getDomain() + '/user/account';
        const headersPublic = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configPublic = { headers: headersPublic };
        return axios.get(urlPublic, configPublic)
            .then(response => {
                this.setState({
                    public_key: response.data[0].public_key
                });
                this.handleXDR(this.state.public_key);
            });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
    }

    handleXDR(x)
    {
        const url = this.Auth.getDomain() + '/user/stellar/asset/accept';
        const formData= {
            public_key: x,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        axios.post(url, formData, config)
            .then(response =>{
                this.setState({
                    xdr: response.data.xdr,
                });
            });
    }

    handleFormSubmit(e){
        e.preventDefault();
        if(!isValidSecretKey(this.state.secret_key))
        {
            this.setState({
                inValidSecretKey: true,
            });
            return true;
        }
        this.setState({
            load: !this.state.load
        });
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        let keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key);
        //console.log(keypair);
        // let xdr = StellarSdk.xdr.TransactionEnvelope.fromXDR(this.state.xdr,'base64');
        let transaction = new StellarSdk.Transaction(this.state.xdr);
        transaction.sign(keypair);
        let xdr = transaction.toEnvelope().toXDR('base64');
        const url = this.Auth.getDomain() + '/user/stellar/asset/accept/submit';
        const formData = {
            xdr: xdr,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response =>{
                if(response.status === 200){
                    window.location.replace('/Components/Dashboard');
                }
            });
    }

    fixEscape(str)
    {
        return encodeURIComponent(str) ;
    }

    showXdr(e)
    {
        e.preventDefault();
        window.location.replace('https://www.stellar.org/laboratory/#xdr-viewer?input=' + this.fixEscape(this.state.xdr));
    }

    render() {
        let valid = "";
        if(this.state.inValidSecretKey === true)
        {
            valid = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your Secret key invalid
                </div>
            </div>;
        }
        let loader = "";
        if(this.state.load === false)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load === true)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        return (
            <div className="col-sm-7 col-12 clearfix mx-auto">
                <div className="row">
                    {valid}
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Stellar account trust</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="secret_key">Secret key</label>
                                <input id='showOrHidden' className="col-sm-9 col-12 mt-3 p-2 rounded-left shadow-lg text-center" placeholder="Secret key : SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" required="required" type="password" onChange={this.handleChange}/>
                                <a className='col-sm-1 col-12 text-center bg-warning rounded-right text-light mt-3' onMouseDown={this.showPass} onMouseUp={this.hiddenPass}><FontAwesomeIcon className="mt-3 col-12 pr-0 pl-0" icon={faEye}/></a>
                                <a onClick={this.showXdr} className='col-sm-2 col-12 text-center text-light pr-0 mt-3'><div className='col-12 pt-2 pb-2 rounded  bg-warning border border-warning pr-0 pl-0'>XDR</div></a>
                            </div>
                        </div>
                        {loader}
                    </form>
                </div>
            </div>
        );
    }
}

export default Trust;