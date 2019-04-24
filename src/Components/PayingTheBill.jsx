import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Container, Row, Col} from 'bootstrap-4-react';
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

class PayingTheBill extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleForSignWithSecretKey = this.handleForSignWithSecretKey.bind(this);
        this.state = {
            public_key: '',
            xdr: '',
            hash: '',
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
    }

    checkBill(y) {
        let a = [];
        let b = [];
        let c = 0;
        let d = 0;
        for (let i = 0; i < y.length; i++) {
            a[i] = parseInt((y / Math.pow(10, i)) % 10);
        }
        b[1] = a[1] * 2;
        b[2] = a[2] * 3;
        b[3] = a[3] * 4;
        b[4] = a[4] * 5;
        b[5] = a[5] * 6;
        c = b[1] + b[2] + b[3] + b[4] + b[5];
        if (a[6]) {
            b[6] = a[6] * 7;
            c = b[1] + b[2] + b[3] + b[4] + b[5] + b[6];
        }
        if (a[7]) {
            b[6] = a[6] * 7;
            b[7] = a[7] * 2;
            c = b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + b[7];
        }
        if (a[8]) {
            b[6] = a[6] * 7;
            b[7] = a[7] * 2;
            b[8] = a[8] * 3;
            c = b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8];
        }
        if (a[9]) {
            b[6] = a[6] * 7;
            b[7] = a[7] * 2;
            b[8] = a[8] * 3;
            b[9] = a[9] * 4;
            c = b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8] + b[9];
        }
        if (a[10]) {
            b[6] = a[6] * 7;
            b[7] = a[7] * 2;
            b[8] = a[8] * 3;
            b[9] = a[9] * 4;
            b[10] = a[10] * 5;
            c = b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8] + b[9] + b[10];
        }
        if (a[11]) {
            b[6] = a[6] * 7;
            b[7] = a[7] * 2;
            b[8] = a[8] * 3;
            b[9] = a[9] * 4;
            b[10] = a[10] * 5;
            b[11] = a[11] * 6;
            c = b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8] + b[9] + b[10] + b[11];
        }
        if (a[12]) {
            b[6] = a[6] * 7;
            b[7] = a[7] * 2;
            b[8] = a[8] * 3;
            b[9] = a[9] * 4;
            b[10] = a[10] * 5;
            b[11] = a[11] * 6;
            b[12] = a[12] * 7;
            c = b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8] + b[9] + b[10] + b[11] + b[12];
        }
        d = 11 - (c % 11);
        this.setState({
            bill: a[1],
            billValid: d,
            valid: a[0]
        });
        if (d == a[0]) {
            return true;
        }
        return false;
    }

    checkPayment(x) {
        let a = [];
        let b = [];
        let c = 0;
        let d = 0;
        let e = parseInt(x / 100000) * 1000;
        for (let i = 0; i < x.length; i++) {
            a[i] = parseInt((x / Math.pow(10, i)) % 10);
        }
        b[2] = a[2] * 2;
        b[3] = a[3] * 3;
        b[4] = a[4] * 4;
        b[5] = a[5] * 5;
        c = b[2] + b[3] + b[4] + b[5];
        if (a[6]) {
            b[6] = a[6] * 6;
            c = b[2] + b[3] + b[4] + b[5] + b[6];
        }
        if (a[7]) {
            b[6] = a[6] * 6;
            b[7] = a[7] * 7;
            c = b[2] + b[3] + b[4] + b[5] + b[6] + b[7];
        }
        if (a[8]) {
            b[6] = a[6] * 6;
            b[7] = a[7] * 7;
            b[8] = a[8] * 2;
            c = b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8];
        }
        if (a[9]) {
            b[6] = a[6] * 6;
            b[7] = a[7] * 7;
            b[8] = a[8] * 2;
            b[9] = a[9] * 3;
            c = b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8] + b[9];
        }
        if (a[10]) {
            b[6] = a[6] * 6;
            b[7] = a[7] * 7;
            b[8] = a[8] * 2;
            b[9] = a[9] * 3;
            b[10] = a[10] * 4;
            c = b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8] + b[9] + b[10];
        }
        if (a[11]) {
            b[6] = a[6] * 6;
            b[7] = a[7] * 7;
            b[8] = a[8] * 2;
            b[9] = a[9] * 3;
            b[10] = a[10] * 4;
            b[11] = a[11] * 5;
            c = b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8] + b[9] + b[10] + b[11];
        }
        if (a[12]) {
            b[6] = a[6] * 6;
            b[7] = a[7] * 7;
            b[8] = a[8] * 2;
            b[9] = a[9] * 3;
            b[10] = a[10] * 4;
            b[11] = a[11] * 5;
            b[12] = a[12] * 6;
            c = b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8] + b[9] + b[10] + b[11] + b[12];
        }
        d = 11 - (c % 11);
        this.setState({
            payment: e,
            paymentValid: d,
            payValid: a[1]
        });
        if (d == a[1]) {
            return true;
        }
        return false;
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount() {
        const url = this.Auth.getDomain() + '/user/account';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    public_key: response.data[0].public_key
                });
            });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        if (this.checkBill(this.state.billing_code) && this.checkPayment(this.state.payment_code)) {
            this.setState({
                load1: !this.state.load1
            });
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
            var config = {headers};
            return axios.post(url, formData, config)
                .then(response => {
                    this.setState({
                        xdr: response.data.xdr,
                        bill_payment_id: response.data.bill_payment_id
                    });
                })
                .catch(err => {
                    this.setState({
                        load1: false
                    })
                })
        }
    }

    handleForSignWithSecretKey(e) {
        e.preventDefault();
        if (!isValidSecretKey(this.state.secret_key)) {
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
        const url = `${this.Auth.domain}/user/stellar/withdraw/submit`;
        const formData = {
            xdr: xdr,
            bill_payment_id: this.state.bill_payment_id,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.post(url, formData, config)
            .then(response => {
                this.setState({
                    hash: response.data.hash,
                });
                if(response.data.title)
                {
                    this.setState({
                        failed: response.data.extras.result_codes.transaction
                    });
                }
                console.log(response);
            })
            .catch(err => {
                this.setState({
                    load2: false
                })
                console.log(err.response);
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
                    This secret key not belong to register stellar account
                </div>
            </div>;
        }
        let validSecret = "";
        if(this.state.inValidSecretKey == true)
        {
            validSecret = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your secret key invalid
                </div>
            </div>;
        }
        let error = '';
        if (!(this.state.billValid == this.state.valid && this.state.paymentValid == this.state.payValid)) {
            error = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    This billing code or payment code is incorrect
                </div>
            </div>
        }
        const project = () => {
            switch (this.state.bill) {
                case 1:
                    return <div className="col-12 text-center">Bill Type : Water Bill</div>;
                case 2:
                    return <div className="col-12 text-center">Bill Type : Electric Bill</div>;
                case 3:
                    return <div className="col-12 text-center"> Bill Type : gas Bill</div>;
                case 4:
                    return <div className="col-12 text-center">Bill Type : Landline Bill</div>;
                case 5:
                    return <div className="col-12 text-center">Bill Type : Phone Bill</div>;
                case 6:
                    return <div className="col-12 text-center">Bill Type : Municipal Tax Complaint Bill</div>;
                case 7:
                    return <div className="col-12 text-center">Bill Type : Bill</div>;
                case 8:
                    return <div className="col-12 text-center">Bill Type : Tax Bill</div>;
                case 9:
                    return <div className="col-12 text-center">Bill Type : Road traffic offenses Bill</div>;
            }
        }
        let loader = "";
        let loader2 = "";
        if (this.state.load1 == false) {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        } else if (this.state.load1 == true) {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        if (this.state.load2 == false) {
            loader2 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        } else if (this.state.load2 == true) {
            loader2 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        if (!this.state.xdr && !this.state.hash) {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        {error}
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Paying the bill</h2>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 bg-warning p-2 rounded-left text-center text-light">Billing code</span>
                                    <input className="col-9 p-2 rounded-right text-center" placeholder=""
                                           name="billing_code" type="tel" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <label className="col-12 mt-3">
                                <div className="row shadow-lg">
                                    <span className="col-3 bg-warning p-2 rounded-left text-center text-light">Payment code</span>
                                    <input className="col-9 p-2 rounded-right text-center" placeholder=""
                                           name="payment_code" type="tel" onChange={this.handleChange}/>
                                </div>
                            </label>
                            {loader}
                        </form>
                    </div>
                </div>
            );
        } else if (this.state.xdr && !this.state.hash) {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        {validSecret}
                        {failTransaction}
                        <h2 className="col-12 text-light font-weight-bold mb-5 text-center">Paying the bill</h2>
                        <div className="col-12 text-cenetr text-light mb-5">
                            <div className="col-12 text-center mb-3">You are paying a bill with this properties :</div>
                            <div className="col-12 text-center mb-3">Billing code : {this.state.billing_code}</div>
                            <div className="col-12 text-center mb-3">Payment code : {this.state.payment_code}</div>
                            {project()}
                            <div className="col-12 text-center mt-3">Bill Amount : {this.state.payment} IRR</div>
                            <div className="col-12 text-center mt-3">Please enter your secret key to approve the transaction.</div>
                        </div>
                        <form className="col-12" onSubmit={this.handleForSignWithSecretKey}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning mt-3">Secret key</span>
                                    <input className="col-9 text-center rounded-right p-2 mt-3"
                                           placeholder="SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX"
                                           name="secret_key" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            {loader2}
                        </form>
                    </div>
                </div>
            );
        } else if (this.state.hash) {
            return (
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
