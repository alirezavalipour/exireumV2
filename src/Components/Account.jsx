import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
var StellarSdk = require('stellar-sdk');
const isValidPublicKey = input => {
    try {
        StellarSdk.Keypair.fromPublicKey(input);
        return true;
    } catch (e) {
        //console.error(e);
        return false;
    }
}

class Account extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.changeCreateOrHaveAccount = this.changeCreateOrHaveAccount.bind(this);
        this.acceptTerm = this.acceptTerm.bind(this);
        this.signXdr = this.signXdr.bind(this);
        this.state = {
            err: "",
            change: "",
            newKeypair: 'null',
            termsAccepted: false,
            term:""
        }
        this.handleGenerate = event => {
            let keypair = StellarSdk.Keypair.random();
            this.setState({
                newKeypair: {
                    pubKey: keypair.publicKey(),
                    secretKey: keypair.secret(),
                }
            });
        }
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });


        // console.log(this.state.public_key);
        // this.someFn(this.state.public_key);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        // start create account
        // const urlCreate = this.Auth.getDomain() + '/user/account/create';
        // const formDataCreate = {
        //     public_key: this.state.newKeypair.pubKey,
        // };
        // const headersCreate = {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${this.Auth.getToken()}`,
        // };
        // var configCreate = { headersCreate };
        // return axios.post(urlAdd, formDataAdd, configCreate)
        //     .then(response =>{
        //         if(response.status == 200){
        //         }
        //     });
        // end create account
        const urlAdd = this.Auth.getDomain() + '/user/account/add';
        const formDataAdd = {
            public_key: this.state.public_key,
        };
        const headersAdd = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configAdd = { headers: headersAdd };
        const urlBank = this.Auth.getDomain() + '/user/bank-account';
        const formDataBank = {
            sheba: this.state.sheba,
            card: this.state.card,
        };
        const headersBank = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configBank = { headers: headersBank };
        const urlAddAcceptAsset = this.Auth.getDomain() + '/user/stellar/asset/accept';
        const formDataAddAcceptAsset = {
            public_key: this.state.public_key,
        };
        const headersAddAcceptAsset = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configAddAcceptAsset = { headers: headersAddAcceptAsset };
        return axios.all([
        axios.post(urlBank, formDataBank, configBank)
            .then(response =>{
                if(response.status == 200){
                }
            }),
        axios.post(urlAdd, formDataAdd, configAdd)
            .then(response =>{
                if(response.status == 200){
                }
            }),
        axios.post(urlAddAcceptAsset, formDataAddAcceptAsset, configAddAcceptAsset)
            .then(response =>{
                if(response.status == 200){
                    this.signXdr(response.data.xdr)
                }
            }),
        ])
        .then(response =>{
            window.location.replace('/Components/Dashboard');
        });
    }

    signXdr (xdr){
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        let keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key);
        //console.log(keypair);
        // let xdr = StellarSdk.xdr.TransactionEnvelope.fromXDR(this.state.xdr,'base64');
        let transaction = new StellarSdk.Transaction(xdr);
        transaction.sign(keypair);
        let xdr1 = transaction.toEnvelope().toXDR('base64');
        const url = this.Auth.getDomain() + '/user/stellar/asset/accept/submit';
        const formData = {
            xdr: xdr1,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response =>{
                if(response.status == 200){
                }
            });
    }

    changeCreateOrHaveAccount(e){
        this.setState( {
            change: e.target.value,
        });
    }
    acceptTerm(e){
        this.setState( {
            term: e.target.value,
        });
    }

    // someFn (public_key) {
    //     console.log(public_key);
    //     this.props.callbackFromParent(public_key);
    // }

    render() {
        let accept;
        let acceptShow = <div className="col-12 bg-warning p-2 rounded shadow-lg text-center">Submit</div>;
        if(this.state.term == "accept")
        {
            acceptShow = <input className="col-12 bg-success p-2 rounded shadow-lg" value="SUBMIT" type="submit"/>;
        }
        let create;
        let have;
        let publicKey="";
        let d = this.props.d;
        if(this.state.change == "create"){
            publicKey = <div className="col-12"><div className="row">
                <input className="col-sm-6 col-12 bg-danger" onClick={this.handleGenerate} value="Generate keypair" type="submit"/>
                <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Generate Public key" name="generate_public_key"/>
                <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Generate Secret key" name="generate_secret_key"/>
            </div></div>;
            if (this.state.newKeypair !== null) {
                publicKey = <div className="col-12"><div className="row">
                    <input className="col-sm-6 col-12 bg-danger p-2 rounded shadow-lg" onClick={this.handleGenerate} value="Generate keypair" type="submit"/>
                    <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Generate Public key" name="generate_public_key" value={this.state.newKeypair.pubKey}/>
                    <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Generate Secret key" name="generate_secret_key" value={this.state.newKeypair.secretKey}/>
                </div></div>;
            }
        }
        else if(this.state.change == "have"){
            publicKey = <div className="col-12"><div className="row">
                <input className="col-12 p-2 rounded shadow-lg" placeholder="Public key : GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO" name="public_key" required="required" type="text" onChange={this.handleChange}/>
                <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Secret key : SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" required="required" type="text" onChange={this.handleChange}/>
            </div></div>;
        }
        return (
            <div className="col-sm-6 col-12 clearfix mx-auto">
                <div className="row">
                    <h2 className="col-12 text-light">Account</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Sheba : IR************************" name="sheba" required="required" type="text" onChange={this.handleChange} />
                        <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Card number : **** **** **** ****" name="card" required="required" type="tel" onChange={this.handleChange} />
                        <div className="p-2 mt-2 col-12">
                            <input type="radio" id="Choice1" name="account" value="create" onChange={this.changeCreateOrHaveAccount}/>
                            <label className="col-5 text-light" htmlFor="Choice1">Create New Account</label>
                            <input type="radio" id="Choice2" name="account" value="have" onChange={this.changeCreateOrHaveAccount}/>
                            <label className="col-5 text-light" htmlFor="Choice2">I Already Have An Account</label>
                        </div>
                        {publicKey}
                        <div className="p-2 mt-2 col-12">
                            <input type="radio" id="Choice3" name="accept" value="accept" onChange={this.acceptTerm}/>
                            <label className="col-5 text-light" htmlFor="Choice3"><a href="#" className="text-light">Accept term and conditions</a></label>
                        </div>
                        {acceptShow}
                    </form>
                </div>
            </div>
        );
    }
}

export default Account;
