import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
var StellarSdk = require('stellar-sdk');
class SendXir extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            price: null,
            public_key:null,
            secret_key:'',
            data: '',
            sam: '',
        }
    }

    handleChange(e) {
        this.setState({
                [e.target.name]: e.target.value,
            });
    }

    componentWillMount() {
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
                    console.log(this.state.public_key);
            });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        StellarSdk.Network.useTestNetwork();
        var keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key_source);
        var destination = this.state.public_key_dest;
        var amount = this.state.amount;
        server.loadAccount(keypair.publicKey())
            .then(function(source) {
                var transaction = new StellarSdk.TransactionBuilder(source)
                    .addOperation(StellarSdk.Operation.payment({
                        destination,
                        amount,
                        asset: StellarSdk.Asset.native()
                    }))
                    .setTimeout(180)
                    .build();
                transaction.sign(keypair);
                server.submitTransaction(transaction)
                    .then(function(result) {
                        console.log(result);
                    });
            });
    }

    render() {
        return(
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <h2 className="col-12 text-light">Send XIR</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <label className="col-12">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 mt-2 rounded-left bg-info">Amount XIR (Exir)</span>
                                <input className="col-9 text-center rounded-right p-2 mt-2" placeholder="" name="amount" type="tel" onChange={this.handleChange}/>
                            </div>
                        </label>
                        <label className="col-12">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 mt-2 rounded-left bg-info">Source secret key</span>
                                <input className="col-9 text-center rounded-right p-2 mt-2" placeholder="SBFHY64P7A4UUONPZJFBUUCI76PCKJXYMA5AESBC4LAETUUOAS55GBI2" name="secret_key_source" type="text" onChange={this.handleChange}/>
                            </div>
                        </label>
                        <label className="col-12">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 mt-2 rounded-left bg-info">Destination public_key</span>
                                <input className="col-9 text-center rounded-right p-2 mt-2" placeholder="GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO" name="public_key_dest" type="text" onChange={this.handleChange}/>
                            </div>
                        </label>
                        <button className="col-md-3 col-sm-6 col-12 bg-success p-2 mt-2 rounded shadow-lg">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}
export default SendXir;