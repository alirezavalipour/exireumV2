import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Container, Row, Col} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';
import NumberFormat from 'react-number-format';
var StellarSdk = require('stellar-sdk');

class SendXir extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            price: null,
            public_key: null,
            secret_key: '',
            data: '',
            sam: '',
            hash: false,
            load: false
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }


    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            load: !this.state.load,
        });
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        StellarSdk.Network.useTestNetwork();
        var keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key_source);
        var destination = this.state.public_key_dest;
        var amount = parseFloat(this.state.amount.replace(/,/g, ''));
        var issuingKeys = StellarSdk.Keypair.fromSecret('SCWZO5OVQLGZ36BNDCDTQOZAYAXVDCHUKS6SFPQSPCPNDLLB6S6IU2NK');
        var XIR = new StellarSdk.Asset('XIR', issuingKeys.publicKey());
        server.loadAccount(keypair.publicKey())
            .then(result => {
            var transaction = new StellarSdk.TransactionBuilder(result)
                .addOperation(StellarSdk.Operation.payment({
                    destination,
                    amount,
                    asset: XIR
                }))
                .setTimeout(180)
                .build();
             transaction.sign(keypair);
             server.submitTransaction(transaction)
                 .then( res => {
                    this.setState({
                        hash: res.hash
                    });
                })
                 .catch(err =>{
                     this.setState({
                         load: false
                     })
                 })
        });

    }

    render() {
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
        if(!this.state.hash) {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Send XIR</h2>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Amount XIR (Exir)</span>
                                    {/*<input className="col-9 text-center rounded-right p-2" placeholder="" name="amount" type="tel" onChange={this.handleChange}/>*/}
                                    <NumberFormat className="col-9 text-center rounded-right p-2 text-light" thousandSeparator={true} name="amount" onChange={this.handleChange} />
                                </div>
                            </label>
                            <label className="col-12 mt-3">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Source secret key</span>
                                    <input className="col-9 text-center rounded-right p-2"
                                           placeholder="SBFHY64P7A4UUONPZJFBUUCI76PCKJXYMA5AESBC4LAETUUOAS55GBI2"
                                           name="secret_key_source" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <label className="col-12 mt-3">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Destination public_key</span>
                                    <input className="col-9 text-center rounded-right p-2"
                                           placeholder="GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO"
                                           name="public_key_dest" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            {loader}
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
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Send XIR</h2>
                        <div className="col-12 text-center text-light p-2">Your order has been registred and will be processed whitin few minutes.</div>
                    </div>
                </div>
            );
        }
    }
}

export default SendXir;