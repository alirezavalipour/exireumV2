import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye} from '@fortawesome/free-solid-svg-icons';
import {} from 'bootstrap-4-react';
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
        this.showPass = this.showPass.bind(this);
        this.hidePass = this.hidePass.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleForSignWithSecretKey = this.handleForSignWithSecretKey.bind(this);
        // this.return = this.return.bind(this);
        this.state = {
            public_key: '',
            xdr: '',
            hash: '',
            load1: false,
            load2: false,
            inValidSecretKey: false,
            key: 0,
        }
    }

    // return(e)
    // {
    //     e.preventDefault();
    //     window.location.replace('/Components/PayingTheBill');
    // }

    showPass(e){
        e.preventDefault();
        document.getElementById('showOrHidden').setAttribute("type", "text");
    }

    hidePass(e)
    {
        e.preventDefault();
        document.getElementById('showOrHidden').setAttribute("type", "password");
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
        if (d === a[0]) {
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
        if (d === a[1]) {
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
                this.assetAmount(this.state.public_key);
            });
    }

    assetAmount(public_key) {
        const url = 'https://horizon.stellar.org/accounts/' + public_key;
        return axios.get(url)
            .then(res =>{
                this.setState({
                    entry: res.data.subentry_count,
                });
                res.data.balances.map(elem =>{
                    if(elem.asset_code === "XIR")
                    {
                        this.setState({
                            xirBalance: elem.balance
                        });
                    }
                    if(elem.asset_type === "native")
                    {
                        this.setState({
                            xlmBalance: elem.balance
                        });
                    }
                    return true;
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
                        load1: false,
                        max: err.response.data.error,
                    })
                })
        }
    }

    handleForSignWithSecretKey(e) {
        e.preventDefault();
        if (!isValidSecretKey(this.state.secret_key)) {
            this.setState({
                inValidSecretKey: true,
                failed: ''
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
        const url = `${this.Auth.domain}/user/bank/bill-payment/submit`;
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
                        failed: response.data.extras.result_codes.transaction,
                        load2: false
                    });
                }
            })
            .catch(err => {
                this.setState({
                    load2: false
                })
            })
    }

    fixEscape(str)
    {
        return encodeURIComponent(str) ;
    }

    render() {
        let priceXlm = '';
        if(this.state.xirBalance)
        {
            priceXlm = parseInt(this.state.xirBalance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' XIR';
        }
        let failTransaction = "";
        if(this.state.failed === 'tx_failed')
        {
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your account doesn't have enough XIR to send
                </div>
            </div>;
        }
        else if(this.state.failed === 'tx_bad_auth')
        {
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    This secret key not belong to register stellar account
                </div>
            </div>;
        }
        else if(this.state.inValidSecretKey === true)
        {
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your secret key invalid
                </div>
            </div>;
        }
        let error = '';
        if (!(this.state.billValid === this.state.valid && this.state.paymentValid === this.state.payValid)) {
            error = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    This billing code or payment code is incorrect
                </div>
            </div>
        }
        let failOrder= '';
        if(this.state.max)
        {
            failOrder = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    {this.state.max}
                </div>
            </div>;
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
        if (!this.state.xdr && !this.state.hash) {
            return (
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 alireza">
                            <div className="col-sm-8 col-12 clearfix mx-auto mt-3 mb-5">
                                <div className="row">
                                    {error}
                                    {failOrder}
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
                                                <div className="col-12 mt-2 text-center">For paying a bill,</div>
                                                <div className="col-12 mt-2 mb-2 text-center">enter its billing code and payment code.</div>
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
                                            <div className="col-sm-11 pl-0 d-none d-sm-block small font-weight-bold">Paying the bill</div>
                                            <div className="col-12 d-sm-none d-bolck small font-weight-bold">Paying the bill</div>
                                        </div>
                                    </div>
                                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                                        <div className='col-12 text-center mt-3 font-weight-bold small'>Available : {priceXlm}</div>
                                        <label className="col-12 mt-3">
                                            <div className="row">
                                                <span className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Billing code :</span>
                                                <input required='required' className="col-sm-9 col-12 input2 pt-1 pb-1 rounded text-center" placeholder="" name="billing_code" type="tel" onChange={this.handleChange}/>
                                            </div>
                                        </label>
                                        <label className="col-12 mt-3">
                                            <div className="row">
                                                <span className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Payment code :</span>
                                                <input required='required' className="col-sm-9 col-12 input2 pt-1 pb-1 rounded text-center" placeholder="" name="payment_code" type="tel" onChange={this.handleChange}/>
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
        } else if (this.state.xdr && !this.state.hash) {
            return (
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 alireza">
                            <div className="col-sm-8 col-12 clearfix mx-auto mt-3 mb-5">
                                <div className="row">
                                    {failTransaction}
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
                                                <div className="col-12 mt-2 text-center">You are paying a bill with this properties :</div>
                                                <div className="col-12 mt-2 text-center">Billing code : {this.state.billing_code}</div>
                                                <div className="col-12 mt-2 text-center">Payment code : {this.state.payment_code}</div>
                                                {project()}
                                                <div className="col-12 mt-2 text-center">Bill Amount : {this.state.payment} IRR</div>
                                                <div className="col-12 mt-2 mb-2 text-center">Please enter your secret key to approve the transaction.</div>
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
                                            <div className="col-sm-11 d-none d-sm-block pl-0 small font-weight-bold">Paying the bill</div>
                                            <div className="col-12 d-sm-none d-block small font-weight-bold">Paying the bill</div>
                                        </div>
                                    </div>
                                    {/*<a className="col-12" onClick={this.return}>*/}
                                        {/*<div className="col-3 bg-warning text-center rounded shadow-lg text-light pt-2 pb-2">*/}
                                            {/*RETURN*/}
                                        {/*</div>*/}
                                    {/*</a>*/}
                                    <form className="col-12" onSubmit={this.handleForSignWithSecretKey}>
                                        <label className="col-12 mt-3">
                                            <div className="row">
                                                <span className="col-sm-2 col-12 pt-1 pb-1 small font-weight-bold">Secret key :</span>
                                                <input required='required' id='showOrHidden' className="col-8 input2 text-center pt-1 pb-1 rounded-left" placeholder="SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" type="password" onChange={this.handleChange}/>
                                                <a className='col-sm-1 col-2 text-center bg-warning text-light pt-1 pb-1' onMouseDown={this.showPass} onMouseUp={this.hidePass}><FontAwesomeIcon className="col-12 pr-0 pl-0" icon={faEye}/></a>
                                                <a target='_blank' href={'https://www.stellar.org/laboratory/#xdr-viewer?input=' + this.fixEscape(this.state.xdr)} className='col-sm-1 col-2 text-center text-light bg-warning pr-0 pl-0 pt-2 pb-2 click-border rounded-right small font-weight-bold'>XDR</a>
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
        } else if (this.state.hash) {
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
                                                <div className="col-12 font-weight-bold mt-2 mb-2 text-center">Your transaction has been done successfully.</div>
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
                                            <div className="col-sm-11 d-sm-block d-none pl-0 small font-weight-bold">Exchange XIR with XLM</div>
                                            <div className="col-12 d-sm-none d-block small font-weight-bold">Exchange XIR with XLM</div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <div className="row">
                                            <div className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Your transaction hash :</div>
                                            <a className="col-sm-9 col-12 pt-1 pb-1 word-wrap" target='_blank' href={'https://horizon.stellar.org/transactions/' + this.state.hash}>{this.state.hash}</a>
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

export default PayingTheBill;
