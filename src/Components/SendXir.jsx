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

class SendXir extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClickButton = this.handleClickButton.bind(this);
        this.state = {
            price: null,
            public_key: null,
            secret_key: '',
            data: '',
            sam: '',
            hash: false,
            load: false,
            inValidSecretKey: false,
            inValidPublicKey: false,
            button: false,
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleClickButton(e)
    {
        e.preventDefault();
        if(!isValidPublicKey(this.state.public_key_dest))
        {
            this.setState({
                inValidPublicKey: true,
            });
            return true;
        }
        this.setState({
            button: true,
        });
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        if(!isValidSecretKey(this.state.secret_key_source))
        {
            this.setState({
                inValidSecretKey: true,
            });
            return true;
        }
        this.setState({
            load: !this.state.load,
        });
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        StellarSdk.Network.useTestNetwork();
        var keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key_source);
        var destination = this.state.public_key_dest;
        var amount = this.state.amount.replace(/,/g, '');
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
                        hash: res.hash,
                    });
                })
                 .catch(err =>{
                     let datas = err.response;
                     this.setState({
                         load: false,
                         failed: datas.data.extras.result_codes.operations[0]
                     });
                 })
        });

    }

    render() {
        let failTransaction = "";
        if(this.state.failed == 'op_underfunded')
        {
            this.state.load2 = false;
            this.state.inValidPublicKey = false;
            this.state.inValidSecretKey = false;
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your account doesn't have enough XIR to send
                </div>
            </div>;
        }
        else if(this.state.failed == 'op_no_trust')
        {
            this.state.load2 = false;
            this.state.inValidPublicKey = false;
            this.state.inValidSecretKey = false;
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Receiver account doesn't have trust to XIR
                </div>
            </div>;
        }
        else if(this.state.failed == 'op_src_no_trust')
        {
            this.state.load2 = false;
            this.state.inValidPublicKey = false;
            this.state.inValidSecretKey = false;
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your account doesn't Have trust to XIR
                </div>
            </div>;
        }
        let valid = "";
        let valids ="";
        if(this.state.inValidSecretKey == true)
        {
            valid = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your secret key invalid
                </div>
            </div>;
        }

        if(this.state.inValidPublicKey == true)
        {
            valids = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your public key invalid
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
        if(!this.state.hash && !this.state.button) {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        {valids}
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Send XIR</h2>
                        <form className="col-12" onSubmit={this.handleClickButton}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Amount XIR (Exir)</span>
                                    {/*<input className="col-9 text-center rounded-right p-2" placeholder="" name="amount" type="tel" onChange={this.handleChange}/>*/}
                                    <NumberFormat className="col-9 text-center rounded-right p-2 text-light" thousandSeparator={true} name="amount" onChange={this.handleChange} />
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
        else if(!this.state.hash && this.state.button)
        {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        {failTransaction}
                        {valid}
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Send XIR</h2>
                        <div className="col-12 text-center text-light mb-3">You are sending {this.state.amount} XIR to the following address :</div>
                        <div className="col-12 text-center text-light mb-3">{this.state.public_key_dest}</div>
                        <div className="col-12 text-center text-light mb-5">Please enter your secret key to approve the transaction.</div>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <label className="col-12 mt-3">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Source secret key</span>
                                    <input className="col-9 text-center rounded-right p-2"
                                           placeholder="SBFHY64P7A4UUONPZJFBUUCI76PCKJXYMA5AESBC4LAETUUOAS55GBI2"
                                           name="secret_key_source" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            {loader}
                        </form>
                    </div>
                </div>
            );
        }
        else if(this.state.hash && this.state.button)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Send XIR</h2>
                        <div className="col-12 text-center text-light p-2">Your transaction has been done successfully.</div>
                        <div className="col-12 text-center text-light p-2 mt-3">Your transaction hash : <a target='_blank' href={'https://horizon-testnet.stellar.org/transactions/' + this.state.hash}>{this.state.hash}</a></div>
                    </div>
                </div>
            );
        }
    }
}

export default SendXir;