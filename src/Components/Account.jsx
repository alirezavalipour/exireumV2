import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';
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

class Account extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.changeCreateOrHaveAccount = this.changeCreateOrHaveAccount.bind(this);
        this.acceptTerm = this.acceptTerm.bind(this);
        this.signXdr = this.signXdr.bind(this);
        this.showPlacholder = this.showPlacholder.bind(this);
        this.state = {
            err: "",
            change: "",
            newKeypair: 'null',
            termsAccepted: false,
            term:"",
            load: false,
            inValidSecretKey: false,
            inValidPublicKey: false,
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

    showPlacholder(e)
    {
        e.preventDefault();
        e.currentTarget.children[0].children[0].setAttribute("class", "enable text-left text-light placholder pr-2 pl-2");
        e.currentTarget.children[0].children[1].removeAttribute("placeholder");
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
        if(!isValidSecretKey(this.state.secret_key)  && isValidPublicKey(this.state.public_key))
        {
            this.setState({
                inValidSecretKey: true,
            });
            return true;
        }
        else if(isValidSecretKey(this.state.secret_key)  && !isValidPublicKey(this.state.public_key))
        {
            this.setState({
                inValidPublicKey: true,
            });
            return true;
        }
        if (!(isValidSecretKey(this.state.secret_key)  && isValidPublicKey(this.state.public_key))) {
            this.setState({
                inValidSecretKey: true,
                inValidPublicKey: true,
            });
            return true;
        }
        this.setState({
           load: !this.state.load
        });
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
                console.log(response);
            })
            .catch(err=>{
                console.log(err.response);
            }),
        axios.post(urlAdd, formDataAdd, configAdd)
            .then(response =>{
                if(response.status == 200){
                }
            }),
        axios.post(urlAddAcceptAsset, formDataAddAcceptAsset, configAddAcceptAsset)
            .then(response =>{
                if(response.status == 200){
                    this.signXdr(response.data.xdr);
                }
            })
            .catch(err =>{
               this.setState({
                   load: false,
               })
            }),

        ]);
    }

    signXdr(xdr){
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
                    // window.location.replace('/Components/Dashboard');
                }
            })
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
        let valid = "";
        if(this.state.inValidSecretKey == true && this.state.inValidPublicKey == false)
        {
            valid = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your Secret key invalid
                </div>
            </div>;
        }
        else if(this.state.inValidPublicKey == true && this.state.inValidSecretKey == false)
        {
            valid = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your Public key invalid
                </div>
            </div>;
        }
        else if(this.state.inValidPublicKey == true && this.state.inValidSecretKey == true)
        {
            valid = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your Public key and Secret key invalid
                </div>
            </div>;
        }
        let loader = "";
        if(this.state.load == false)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load == true)
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
        let accept;
        let acceptShow = <div className="col-12 p-2 mt-2 border-div rounded shadow-lg text-center">Submit</div>;
        if(this.state.term == "accept")
        {
            acceptShow = loader;
        }
        let create;
        let have;
        let publicKey="";
        let d = this.props.d;
        if(this.state.change == "create"){
            publicKey = <div className="col-12">
                <div className="row">
                    <input className="col-12 mt-2 p-2 bg-warning rounded shadow-lg" onClick={this.handleGenerate} value="Generate keypair" type="submit"/>
                    <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                        <div className="row">
                            <label className="disable" htmlFor="generate_public_key">Generate Public key</label>
                            <input className="col-12 mt-3 p-2 rounded shadow-lg" placeholder="Generate Public key" name="generate_public_key"/>
                        </div>
                    </div>
                    <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                        <div className="row">
                            <label className="disable" htmlFor="generate_secret_key">Generate Secret key</label>
                            <input className="col-12 mt-3 p-2 rounded shadow-lg" placeholder="Generate Secret key" name="generate_secret_key"/>
                        </div>
                    </div>
                </div>
            </div>;
            if (this.state.newKeypair !== null) {
                publicKey = <div className="col-12">
                    <div className="row">
                        <input className="col-12 mt-2 p-2 bg-warning rounded shadow-lg" onClick={this.handleGenerate} value="Generate keypair" type="submit"/>
                        <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="generate_public_key">Generate Public key</label>
                                <input className="col-12 mt-3 p-2 rounded shadow-lg" placeholder="Generate Public key" name="generate_public_key" value={this.state.newKeypair.pubKey}/>
                            </div>
                        </div>
                        <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="generate_secret_key">Generate Secret key</label>
                                <input className="col-12 mt-3 p-2 rounded shadow-lg" placeholder="Generate Secret key" name="generate_secret_key" value={this.state.newKeypair.secretKey}/>
                            </div>
                        </div>
                    </div>
                </div>;
            }
        }
        else if(this.state.change == "have"){
            publicKey = <div className="col-12">
                <div className="row">
                    <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                        <div className="row">
                            <label className="disable" htmlFor="public_key">Public key</label>
                            <input className="col-12 p-2 mt-3 rounded shadow-lg" placeholder="Public key : GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO" name="public_key" required="required" type="text" onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                        <div className="row">
                            <label className="disable" htmlFor="secret_key">Secret key</label>
                            <input className="col-12 mt-3 p-2 rounded shadow-lg" placeholder="Secret key : SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" required="required" type="text" onChange={this.handleChange}/>
                        </div>
                    </div>
                </div>
            </div>;
        }
        return (
            <div className="col-sm-6 col-12 clearfix mx-auto">
                <div className="row">
                    {valid}
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Account</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="sheba">Sheba</label>
                                <input className="col-12 p-2 mt-3 rounded shadow-lg" placeholder="Sheba : IR************************" name="sheba" required="required" type="text" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="card">Card number</label>
                                <input className="col-12 mt-3 p-2 rounded shadow-lg" placeholder="Card number : **** **** **** ****" name="card" required="required" type="tel" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="p-2 mt-3 col-12">
                            <input type="radio" id="Choice1" name="account" value="create" onChange={this.changeCreateOrHaveAccount}/>
                            <label className="col-5 text-light" htmlFor="Choice1">Create New Account</label>
                            <input type="radio" id="Choice2" name="account" value="have" onChange={this.changeCreateOrHaveAccount}/>
                            <label className="col-5 text-light" htmlFor="Choice2">I Already Have An Account</label>
                        </div>
                        {publicKey}
                        <div className="p-2 mt-3 col-12">
                            <input type="checkbox" id="Choice3" name="accept" value="accept" onChange={this.acceptTerm}/>
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
