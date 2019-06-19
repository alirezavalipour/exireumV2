import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';
import {faEye} from "@fortawesome/free-solid-svg-icons";
import NumberFormat from "./ExchangeXir";
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

const isValidPublicKey = input => {
    try {
        StellarSdk.Keypair.fromPublicKey(input);
        return true;
    } catch (e) {
        // console.error(e);
        return false;
    }
};

class ChangeAccount extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleXdr = this.handleXdr.bind(this);
        this.showPass = this.showPass.bind(this);
        this.hiddenPass = this.hiddenPass.bind(this);
        this.state = {
            load1: false,
            load2: false,
            inValidSecretKey: false,
            inValidPublicKey: false,
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
                this.setState({
                   public_key: response.data[0].public_key,
                });
                // this.assetAmount(response.data[0].public_key);
            });
    }

    // assetAmount(public_key) {
    //     const url = 'https://horizon-testnet.stellar.org/accounts/' + public_key;
    //     return axios.get(url)
    //         .then(res =>{
    //             this.setState({
    //                 entry: res.data.subentry_count,
    //             });
    //             let trustFlag = false;
    //             res.data.balances.map(elem =>{
    //                 if(elem.asset_code == 'XIR')
    //                 {
    //                     trustFlag = true;
    //                 }
    //             });
    //             if (trustFlag)
    //             {
    //                 window.location.replace('/Components/Dashboard');
    //             }
    //         });
    // }

    showPass(e){
        e.preventDefault();
        document.getElementById('showOrHidden').setAttribute("type", "text");
    }

    hiddenPass(e){
        e.preventDefault();
        document.getElementById('showOrHidden').setAttribute("type", "password");
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
    }

    handleFormSubmit(e){
        e.preventDefault();
        if(!isValidPublicKey(this.state.public_key))
        {
            this.setState({
                inValidPublicKey: true,
            });
            return true;
        }
        this.setState({
            load1: !this.state.load1
        });
        const url = this.Auth.getDomain() + '/user/account/change';
        const formData= {
            public_key: this.state.public_key,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response =>{
                this.setState({
                    msg: response.data.msg
                });
                this.handleXDR(this.state.public_key);
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

    handleXdr(e){
        e.preventDefault();
        if(!isValidSecretKey(this.state.secret_key))
        {
            this.setState({
                inValidSecretKey: true,
            });
            return true;
        }
        this.setState({
            load2: !this.state.load2
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
                    // window.location.replace('/Components/Dashboard');
                    this.setState({
                       hash: response.data.hash,
                    });
                }
            });
    }

    fixEscape(str)
    {
        return encodeURIComponent(str) ;
    }

    render() {
        let valid1 = "";
        let valid2 = "";
        if(this.state.inValidPublicKey === true)
        {
            valid1 = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 rounded shadow-lg text-center mt-3">
                    Your public key invalid
                </div>
            </div>;
        }
        if(this.state.inValidSecretKey === true)
        {
            valid2 = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 rounded shadow-lg text-center mt-3">
                    Your secret key invalid
                </div>
            </div>;
        }
        let loader = "";
        if(this.state.load1 === false)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load1 === true)
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
        let loader2 = "";
        if(this.state.load2 === false)
        {
            loader2 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load2 === true)
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
        if(!this.state.msg && !this.state.hash)
        {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        {valid1}
                        <h4 className="col-12 text-light text-center mt-5 mb-5">Change stellar account</h4>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <label className="col-12 ">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light rounded-left bg-warning pt-2 pb-2">Public key</span>
                                    <input className="col-sm-9 col-12 rounded-right shadow-lg text-center pt-2 pb-2" name="public_key" required="required" type="text" value={this.state.public_key} onChange={this.handleChange}/>
                                </div>
                            </label>
                            {loader}
                        </form>
                    </div>
                </div>
            );
        }
        else if(this.state.msg && !this.state.hash)
        {
            return (
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    {valid2}
                    <h4 className="col-12 text-light text-center mt-5 mb-5">Change stellar account</h4>
                    <form className="col-12" onSubmit={this.handleXdr}>
                        <label className="col-12">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Secret key</span>
                                <input id='showOrHidden' className="col-7 text-center p-2" required='required' placeholder="SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" type="password" onChange={this.handleChange}/>
                                <a className='col-1 text-center bg-warning rounded-right text-light' onMouseDown={this.showPass} onMouseUp={this.hiddenPass}><FontAwesomeIcon className="mt-3 col-12 pr-0 pl-0" icon={faEye}/></a>
                                <a target='_blank' href={'https://www.stellar.org/laboratory/#xdr-viewer?input=' + this.fixEscape(this.state.xdr)} className='col-1 text-center text-light pr-0'><div className='col-12  pt-2 pb-2 rounded  bg-warning border border-warning pr-0 pl-0'>XDR</div></a>
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
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h4 className="col-12 text-light text-center mt-5 mb-5">Change stellar account</h4>
                        <div className="col-12 text-center text-light p-2">Your stellar account has been changed successfully.</div>
                        <div className="col-12 text-center text-light p-2 mt-3">Your change hash : <a target='_blank' href={'https://horizon-testnet.stellar.org/transactions/' + this.state.hash}>{this.state.hash}</a></div>
                        <a href="../Components/Dashboard" className='col-sm-4 col-12 text-center text-light pt-2 pb-2 mt-3 bg-warning mx-auto rounded shadow-lg'>Back to dashboard</a>
                    </div>
                </div>
            );
        }
    }
}

export default ChangeAccount;
