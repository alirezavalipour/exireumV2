import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
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

class WithdrawedXirWithSheba extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleForSignWithSecretKey = this.handleForSignWithSecretKey.bind(this);
        this.state = {
            price: null,
            public_key:null,
            secret_key:'',
            data: '',
            sam: '',
            load1: false,
            load2: false,
            inValidSecretKey: false,
        }
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });


        if(e.target.name == "amount"){
            let amount =  parseFloat(e.target.value.replace(/,/g, ''));
            var url= `${this.Auth.domain}/user/convert?type=withdraw&amount=` + amount;
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.Auth.getToken()}`,
            };
            var config = { headers };
            return axios.get(url, config)
                .then(response =>{
                    this.setState({
                        rial: response.data.result
                    })
                });
        }
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount() {
        const url = this.Auth.getDomain() + '/user/bank-account';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        const urlPublic = this.Auth.getDomain() + '/user/account';
        const headersPublic = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configPublic = { headers: headersPublic };
        return axios.all([
            axios.get(url, config)
                .then(response => {
                    this.setState({
                        sheba: response.data[1].sheba
                    });
                    this.shebaInfo(response.data[1].sheba);
                }),
            axios.get(urlPublic, configPublic)
                .then(response => {
                    this.setState({
                        public_key: response.data[0].public_key
                    });
                })
        ]);
    }

    shebaInfo(x){
        const url = this.Auth.getDomain() + '/user/bank/get-sheba-info';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };

        const formData = {
            sheba: x,
        };
        var config = { headers };
        return axios.get(url + "?sheba="+ x , config)
            .then(response => {
                this.setState({
                    first_name: response.data.Data.AccountOwners[0].FirstName,
                    last_name: response.data.Data.AccountOwners[0].LastName,
                });
            })
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            load1: !this.state.load1
        });
        const url = `${this.Auth.domain}/user/stellar/withdraw`;
        const formData = {
            amount: parseFloat(this.state.amount.replace(/,/g, '')),
            public_key: this.state.public_key,
            sheba: this.state.sheba,
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
                    xdr: response.data.xdr,
                    withdraw_id: response.data.withdraw_id
                });
            }).catch(err =>{
                this.setState({
                    load1: false
                })
            })

    }

    handleForSignWithSecretKey(e){
        e.preventDefault();
        if (!isValidSecretKey(this.state.secret_key)) {
            this.setState({
                inValidSecretKey: true,
            });
            return true;
        }
        this.setState({
           load2:!this.state.load2
        });
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        let keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key);
        //console.log(keypair);
        // let xdr = StellarSdk.xdr.TransactionEnvelope.fromXDR(this.state.xdr,'base64');
        let transaction = new StellarSdk.Transaction(this.state.xdr);
        transaction.sign(keypair);
        let xdr = transaction.toEnvelope().toXDR('base64');
        const url = `${this.Auth.domain}/user/stellar/withdraw/submit`;
        const formData = {
            xdr: xdr,
            withdraw_id: this.state.withdraw_id,
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
                    hash: response.data.hash,
                })
                if(response.data.title)
                {
                    this.setState({
                        failed: response.data.extras.result_codes.transaction
                    });
                }
            })
            .catch(err =>{
                this.setState({
                    load2: false
                })
            })
    }


    render() {
        let failTransaction = "";
        if(this.state.failed == 'tx_bad_auth')
        {
            this.state.load2 = false;
            this.state.inValidSecretKey = false;
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    This Secret key not belong to register stellar account
                </div>
            </div>;
        }
        let validSecret = "";
        if(this.state.inValidSecretKey == true)
        {
            validSecret = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your Secret key invalid
                </div>
            </div>;
        }
        let loader = "";
        let loader2 ="";
        if(this.state.load1 == false)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load1 == true)
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
        if(this.state.load2 == false)
        {
            loader2 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load2 == true)
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

        if(!this.state.xdr && !this.state.hash)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Withdrawed XIR to bank account</h2>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Amount XIR (Exir)</span>
                                    {/*<input className="col-9 text-center rounded-right p-2" placeholder="" name="amount" minLength="5" type="tel" onChange={this.handleChange}/>*/}
                                    <NumberFormat className="col-9 text-center rounded-right p-2 text-light" thousandSeparator={true} minLength="5" name="amount" onChange={this.handleChange} />
                                </div>
                            </label>
                            <label className="col-12 mt-3">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Destination account (Sheba)</span>
                                    <input className="col-9 text-center rounded-right p-2 text-light" placeholder={this.state.sheba} name="sheba" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <label className="col-12 mt-3">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Amount will be IRR (Rial)</span>
                                    <div className="col-9 text-center rounded-right p-2 border-div">  {this.state.rial}  </div>
                                </div>
                            </label>
                            {loader}
                        </form>
                    </div>
                </div>
            );
        }
        else if(this.state.xdr && !this.state.hash)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        {validSecret}
                        {failTransaction}
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Withdrawed XIR to bank account</h2>
                        <div className="col-12 text-center text-light font-size-bold">Sheba : {this.state.sheba}</div>
                        <div className="col-12 text-center text-light font-size-bold mt-3">First Name : {this.state.first_name}</div>
                        <div className="col-12 text-center text-light font-size-bold mt-3">Last Name : {this.state.last_name}</div>
                        <div className="col-12 text-center text-light mt-3 mb-5">Please enter your Secret key to approve the transaction.</div>
                        <form className="col-12" onSubmit={this.handleForSignWithSecretKey}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning mt-3">Secret key</span>
                                    <input className="col-9 text-center rounded-right p-2 mt-3" placeholder="SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" type="text" onChange={this.handleChange}/>
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
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Withdrawed XIR to bank account</h2>
                        <div className="col-12 text-center text-light p-2">Your order has been registred and will be processed whitin few minutes.</div>
                    </div>
                </div>
            );
        }
    }
}
export default WithdrawedXirWithSheba;