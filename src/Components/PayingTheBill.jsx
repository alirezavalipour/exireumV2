import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
var StellarSdk = require('stellar-sdk');
class PayingTheBill extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleForSignWithSecretKey = this.handleForSignWithSecretKey.bind(this);
        this.state = {
            public_key:'',
            xdr:'',
            hash:'',
        }
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
    }

    componentWillMount() {
        const url = this.Auth.getDomain() + '/user/account';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    public_key: response.data[56].public_key
                })
                console.log(this.state.public_key);
            })
    }

    handleFormSubmit(e){
        e.preventDefault();
        const url = this.Auth.getDomain() + '/user/bank/bill-payment';
        const formData = {
            billing_code: this.state.billing_code,
            payment_code: this.state.payment_code,
            public_key: this.state.public_key,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response => {
                this.setState({
                    xdr: response.data.xdr,
                    billPaymentId: response
                });
                console.log(response);
            });
    }

    handleForSignWithSecretKey(e){
        e.preventDefault();
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        let keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key);
        //console.log(keypair);
        // let xdr = StellarSdk.xdr.TransactionEnvelope.fromXDR(this.state.xdr,'base64');
        let transaction = new StellarSdk.Transaction(this.state.xdr);
        transaction.sign(keypair);
        let xdr = transaction.toEnvelope().toXDR('base64');
        console.log(xdr);
        const url = `${this.Auth.domain}/user/stellar/withdraw/submit`;
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
                this.setState({
                    hash: response.data.hash
                })
            })
    }

    render() {
        if (!this.state.xdr && !this.state.hash) {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Paying the bill</h2>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 bg-warning p-2 rounded-left text-center text-light">Billing code</span>
                                    <input className="col-9 p-2 rounded-right text-center" placeholder="" name="billing_code" type="tel" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <label className="col-12 mt-3">
                                <div className="row shadow-lg">
                                    <span className="col-3 bg-warning p-2 rounded-left text-center text-light">Payment code</span>
                                    <input className="col-9 p-2 rounded-right text-center" placeholder="" name="payment_code" type="tel" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <button className="col-12 bg-warning p-2 mt-3 rounded shadow-lg">Pay</button>
                        </form>
                    </div>
                </div>
            );
        } else if (this.state.xdr && !this.state.hash) {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Paying the bill</h2>
                        <form className="col-12" onSubmit={this.handleForSignWithSecretKey}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Secret key</span>
                                    <input className="col-9 text-center rounded-right p-2" placeholder="SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <button className="col-12 bg-warning p-2 mt-3 rounded shadow-lg">Submit</button>
                        </form>
                    </div>
                </div>
            );
        } else if(this.state.hash){
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Paying the bill</h2>
                        <div className="col-12 text-center text-light p-2">Your bill has been registred.</div>
                    </div>
                </div>
            );
        }
    }
}

export default PayingTheBill;
