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
                console.log(this.state.xdr);
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
        StellarSdk.Network.usePublicNetwork();
        var server = new StellarSdk.Server('https://horizon.stellar.org');
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
        let loader2 ="";
        if(this.state.load1 === false)
        {
            loader = <div className="col-12 text-right pr-0 pl-0">
                <button className="col-sm-2 col-12 bg-warning rounded shadow-lg text-light mb-3 mt-2 small font-weight-bold pt-1 pb-1">SUBMIT</button>
            </div>;
        }
        else if(this.state.load1 === true)
        {
            loader = <div className="col-12 text-right pr-0 pl-0">
                <button className="col-sm-2 col-12 bg-warning rounded shadow-lg mb-3 mt-2 text-light pt-1 pb-1">
                    <Loader
                        type="ThreeDots"
                        color="#fff"
                        height="20"
                        width="40"
                    />
                </button>
            </div>;
        }
        if(this.state.load2 === false)
        {
            loader2 = <div className="col-12 text-right pr-0 pl-0">
                <button className="col-sm-2 col-12 bg-warning rounded shadow-lg text-light mb-3 mt-2 small font-weight-bold pt-1 pb-1">SUBMIT</button>
            </div>;
        }
        else if(this.state.load2 === true)
        {
            loader2 = <div className="col-12 text-right pr-0 pl-0">
                <button className="col-sm-2 col-12 bg-warning rounded shadow-lg mb-3 mt-2 text-light pt-1 pb-1">
                    <Loader
                        type="ThreeDots"
                        color="#fff"
                        height="20"
                        width="40"
                    />
                </button>
            </div>;
        }
        if(!this.state.msg && !this.state.hash)
        {
            return (
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 alireza">
                            <div className="col-sm-8 col-12 clearfix mx-auto mt-3 mb-5">
                                <div className="row">
                                    {valid1}
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Create</div>
                                                <div className="bg-warning mx-auto box-height box-height1 box-height-color mt-2">1</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Approve</div>
                                                <div className="bg-light mx-auto box-height box-height2 mt-2">2</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Result</div>
                                                <div className="bg-light mx-auto box-height box-height3 mt-2">3</div>
                                            </div>
                                            <div className="col-sm-9 col-12 bg-light mx-auto rounded shadow-lg box-triangle1 mt-3 small">
                                                <div className="col-12 mt-2 text-center">To change stellar account,</div>
                                                <div className="col-12 mt-2 mb-2 text-center">enter the new public-key you are going to change.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="col-sm-8 col-12 clearfix mx-auto border border-warning shadow-lg rounded mt-3 mb-3">
                                <div className="row">
                                    <div className="col-12 border-bottom border-warning">
                                        <div className="row mt-2 mb-2">
                                            <div className="col-sm-1 d-none d-sm-block icon6"> </div>
                                            <div className="col-sm-11 pl-0 d-none d-sm-block small font-weight-bold">Change stellar account</div>
                                            <div className="col-12 d-sm-none d-bolck small font-weight-bold">Change stellar account</div>
                                        </div>
                                    </div>
                                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                                        <label className="col-12 mt-3">
                                            <div className="row">
                                                <span className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Public key :</span>
                                                <input className="col-sm-9 input2 col-12 text-center rounded pt-1 pb-1 rounded" name="public_key" required="required" type="text" value={this.state.public_key} onChange={this.handleChange}/>
                                            </div>
                                        </label>
                                        {loader}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if(this.state.msg && !this.state.hash)
        {
            return (
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 alireza">
                            <div className="col-sm-8 col-12 clearfix mx-auto mt-3 mb-5">
                                <div className="row">
                                    {valid2}
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Create</div>
                                                <div className="bg-warning mx-auto box-height box-height1 box-height-color mt-2">1</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Approve</div>
                                                <div className="bg-warning mx-auto box-height box-height2 box-height-color mt-2">2</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Result</div>
                                                <div className="bg-light mx-auto box-height box-height3 mt-2">3</div>
                                            </div>
                                            <div className="col-sm-9 col-12 bg-light mx-auto rounded shadow-lg box-triangle2 mt-3 small">
                                                <div className="col-12 mt-2 mb-2 text-center">Please enter your secret-key to change stellar account.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="col-sm-8 col-12 clearfix mx-auto border border-warning shadow-lg mt-3 mb-3">
                                <div className="row">
                                    <div className="col-12 border-bottom border-warning">
                                        <div className="row mt-2 mb-2">
                                            <div className="col-sm-1 d-none d-sm-block icon6"> </div>
                                            <div className="col-sm-11 d-none d-sm-block pl-0 small font-weight-bold">Change stellar account</div>
                                            <div className="col-12 d-sm-none d-block small font-weight-bold">Change stellar account</div>
                                        </div>
                                    </div>
                                    <form className="col-12" onSubmit={this.handleXdr}>
                                        <label className="col-12 mt-3">
                                            <div className="row">
                                                <span className="col-sm-2 col-12 pt-1 pb-1 small font-weight-bold">Secret key :</span>
                                                <input id='showOrHidden' className="col-8 input2 text-center pt-1 pb-1 rounded-left" required='required' placeholder="SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" type="password" onChange={this.handleChange}/>
                                                <a className='col-sm-1 col-2 pt-1 pb-1 text-center bg-warning text-light' onMouseDown={this.showPass} onMouseUp={this.hiddenPass}><FontAwesomeIcon className="col-12 pr-0 pl-0" icon={faEye}/></a>
                                                <a target='_blank' href={'https://www.stellar.org/laboratory/#xdr-viewer?input=' + this.fixEscape(this.state.xdr)} className='col-sm-1 col-2 text-center bg-warning pt-2 pb-2 text-light small font-weight-bold rounded-right click-border pr-0 pl-0'>XDR</a>
                                            </div>
                                        </label>
                                        {loader2}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if(this.state.hash)
        {
            return (
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 alireza">
                            <div className="col-sm-8 col-12 clearfix mx-auto mt-3 mb-5">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Create</div>
                                                <div className="bg-warning mx-auto box-height box-height1 box-height-color mt-2">1</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Approve</div>
                                                <div className="bg-warning mx-auto box-height box-height2 box-height-color mt-2">2</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Result</div>
                                                <div className="bg-warning mx-auto box-height box-height3 box-height-color mt-2">3</div>
                                            </div>
                                            <div className="col-sm-9 col-12 bg-light mx-auto rounded shadow-lg box-triangle3 mt-3 small">
                                                <div className="col-12 font-weight-bold mt-2 mb-2 text-center">Your stellar account has been changed successfully.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="col-sm-8 col-12 clearfix mx-auto border border-warning mt-3 mb-3 shadow-lg rounded">
                                <div className="row">
                                    <div className="col-12 border-bottom border-warning">
                                        <div className="row mt-2 mb-2">
                                            <div className="col-sm-1 d-sm-block d-none icon6"> </div>
                                            <div className="col-sm-11 d-sm-block d-none pl-0 small font-weight-bold">Change stellar account</div>
                                            <div className="col-12 d-sm-none d-block small font-weight-bold">Change stellar account</div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <div className="row">
                                            <div className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Your change hash :</div>
                                            <a className="col-sm-9 col-12 pt-1 pb-1 word-wrap" target='_blank' href={'https://horizon-testnet.stellar.org/transactions/' + this.state.hash}>{this.state.hash}</a>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3 mb-3 text-right">
                                        <a href="../Components/Dashboard" className='col-sm-2 col-12 text-center text-light pt-2 pb-2 bg-warning rounded ml-auto small font-weight-bold'>Back to dashboard</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default ChangeAccount;
