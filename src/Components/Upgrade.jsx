import React, { Component } from 'react';
import '../App.css';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
var StellarSdk = require('stellar-sdk');

class Upgrade extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.signWithSecretKey = this.signWithSecretKey.bind(this);
        this.showPass = this.showPass.bind(this);
        this.hidePass = this.hidePass.bind(this);
        this.state = {
            load1: false,
            load2: false,
        }
    }

    showPass(e){
        e.preventDefault();
        document.getElementById('showOrHidden').setAttribute("type", "text");
    }

    hidePass(e)
    {
        e.preventDefault();
        document.getElementById('showOrHidden').setAttribute("type", "password");
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleFormSubmit(e)
    {
        e.preventDefault();
        this.setState({
           load1: !this.state.load1,
        });
        const url = `${this.Auth.domain}/user/kyc/create`;
        const formData = {
            public_key: this.state.public_key,
            memo: this.state.memo,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response=>{
                this.setState({
                    kyc_id: response.data.kyc_id,
                    xdr: response.data.xdr,
                });
                console.log(response);
            })
            .catch(err =>{
                this.setState({
                    load1: false
                })
            });
    }

    signWithSecretKey(e) {
        e.preventDefault();
        this.setState({
            load2: !this.state.load2,
        });
        StellarSdk.Network.useTestNetwork();
        let keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key);
        let transaction = new StellarSdk.Transaction(this.state.xdr);
        transaction.sign(keypair);
        let xdr = transaction.toEnvelope().toXDR('base64');
        const url = `${this.Auth.domain}/user/kyc/submit`;
        const formData = {
            xdr: xdr,
            kyc_id: this.state.kyc_id
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response=>{
                this.setState({
                    hash: response.data.hash,
                });
            })
            .catch(err =>{
                this.setState({
                    load2: false
                })
            });
    }

    render() {
        let loader1 = "";
        if (this.state.load1 === false)
        {
            loader1 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if (this.state.load1 === true)
        {
            loader1 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        let loader2 = "";
        if (this.state.load2 === false)
        {
            loader2 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if (this.state.load2 === true)
        {
            loader2 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        if(!this.state.xdr && !this.state.hash) {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Upgrade</h2>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <label className='col-12'>
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">KYC public key</span>
                                    <input required='required' className="col-9 text-center rounded-right p-2"
                                           placeholder="GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO"
                                           name="public_key" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <label className='col-12 mt-3'>
                                <div className="row shadow-lg">
                                    <span
                                        className="col-3 text-center text-light p-2 rounded-left bg-warning">Memo</span>
                                    <input required='required' className="col-9 text-center rounded-right p-2"
                                           placeholder="GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO"
                                           name="memo" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            {loader1}
                        </form>
                    </div>
                </div>
            );
        }
        else if(this.state.xdr && !this.state.hash)
        {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Upgrade</h2>
                        <form className="col-12" onSubmit={this.signWithSecretKey}>
                            <label className='col-12'>
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">KYC secret key</span>
                                    <input id='showOrHidden' required='required' className="col-8 text-center p-2" placeholder="SB3JKIKJ7ECA2GBB55KG55KFGUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" type="password" onChange={this.handleChange}/>
                                    <a className='col-1 text-center bg-warning rounded-right text-light' onMouseDown={this.showPass} onMouseUp={this.hidePass}><FontAwesomeIcon className="mt-3 col-12 pr-0 pl-0" icon={faEye}/></a>
                                </div>
                            </label>
                            {loader2}
                        </form>
                    </div>
                </div>
            );
        }
        else if(this.state.hash)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h4 className="col-12 text-light text-center mt-5 mb-5">Upgrade</h4>
                        <div className="col-12 text-center text-light p-2">Your KYC transaction has been done successfully.</div>
                        <div className="col-12 text-center text-light p-2 mt-3">Your transaction hash : <a target='_blank' href={'https://horizon-testnet.stellar.org/transactions/' + this.state.hash}>{this.state.hash}</a></div>
                        <a href="../Components/Dashboard" className='col-sm-4 col-12 text-center text-light pt-2 pb-2 mt-3 bg-warning mx-auto rounded shadow-lg'>Back to dashboard</a>
                    </div>
                </div>
            );
        }
    }
}

export default Upgrade;