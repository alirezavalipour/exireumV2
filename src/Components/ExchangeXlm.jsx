import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEye} from '@fortawesome/free-solid-svg-icons';
import {} from 'bootstrap-4-react';
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

class ExchangeXir extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.showPass = this.showPass.bind(this);
        this.hidePass = this.hidePass.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleForSignWithSecretKey = this.handleForSignWithSecretKey.bind(this);
        // this.return = this.return.bind(this);
        this.state = {
            price: null,
            public_key:null,
            secret_key:'',
            load1: false,
            load2: false,
            inValidSecretKey: false,
            xdr: '',
            key: 0,
            userAmount: false,
        }
    }

    // return(e)
    // {
    //     e.preventDefault();
    //     window.location.replace('/Components/ExchangeXlm');
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


        if(e.target.name == "amount"){
            let amount =  parseFloat(e.target.value.replace(/,/g, ''));
            var url= `${this.Auth.domain}/user/convert?type=XLMTOXIR&amount=` + amount;
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
                this.assetAmount(this.state.public_key);
            });
    }

    assetAmount(public_key) {
        const url = 'https://horizon-testnet.stellar.org/accounts/' + public_key;
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
        if(parseFloat(this.state.amount.replace(/,/g, '')) >= 0 && parseFloat(this.state.amount.replace(/,/g, '')) <= parseFloat((this.state.xlmBalance) - (0.5 * this.state.entry) - 1).toFixed(2))
        {
            this.setState({
                load1: !this.state.load1,
                userAmount: false
            });
            const url = `${this.Auth.domain}/user/stellar/exchange?type=XLMTOXIR`;
            const formData = {
                amount: parseFloat(this.state.amount.replace(/,/g, '')),
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
                        xdr: response.data.response,
                        id: response.data.exchange_id
                    });
                    console.log(response);
                })
                .catch(err =>{
                    this.setState({
                        load1: false,
                        max: err.response.data.error,
                    })
                })
        }
        else
        {
            this.setState({
                userAmount: true
            })
        }
    }

    handleForSignWithSecretKey(e){
        e.preventDefault();
        if (!isValidSecretKey(this.state.secret_key)) {
            this.setState({
                inValidSecretKey: true,
                failed: '',
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
        const url = `${this.Auth.domain}/user/stellar/exchange/submit`;
        const formData = {
            xdr: xdr,
            exchange_id: this.state.id
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
                        failed: response.data.extras.result_codes.transaction,
                        load2: false
                    });
                }
            })
            .catch(err =>{
                this.setState({
                    load2: false
                });
            });
    }

    fixEscape(str)
    {
        return encodeURIComponent(str) ;
    }

    render() {
        let priceXlm = '';
        if(this.state.xlmBalance)
        {
            priceXlm = (parseFloat((this.state.xlmBalance) - (0.5 * this.state.entry) - 1).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' XLM';
        }
        let failAmount= '';
        if(this.state.userAmount === true)
        {
            failAmount = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your amount should be between 10000 and {priceXlm}
                </div>
            </div>;
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
        let failTransaction = "";
        if(this.state.failed === 'tx_failed')
        {
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your account doesn't have enough XLM to send
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
        let loader = "";
        let loader2 ="";
        if(this.state.load1 === false)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load1 === true)
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
        if(this.state.load2 === false)
        {
            loader2 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load2 === true)
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
        let exir = '';
        if(this.state.rial) {
            exir = (parseInt(this.state.rial)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        if(!this.state.xdr && !this.state.hash)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        {failAmount}
                        {failOrder}
                        <h4 className="col-12 text-light text-center mt-5 mb-2">Exchange XLM to XIR</h4>
                        <div className='col-12 text-center text-light mb-5'>Available : {priceXlm}</div>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Amount XLM</span>
                                    {/*<input className="col-9 text-center rounded-right p-2" placeholder="" name="amount" type="tel" onChange={this.handleChange}/>*/}
                                    <NumberFormat required='required' className="col-9 text-center rounded-right p-2 text-light" thousandSeparator={true} name="amount" onChange={this.handleChange} />
                                </div>
                            </label>
                            <label className="col-12 mt-3">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Amount will be XIR</span>
                                    <div className="col-9 text-center rounded-right p-2 border-div">  {exir}  </div>
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
                        {failTransaction}
                        <h4 className="col-12 text-light text-center mt-5 mb-5">Exchange XLM to XIR</h4>
                        <div className="col-12 text-center text-light mb-3">You are changing {this.state.amount} XLM with {exir} XIR</div>
                        <div className="col-12 text-center text-light mb-5">Please enter your secret key to approve the transaction.</div>
                        {/*<a className="col-12 mb-3" onClick={this.return}>*/}
                            {/*<div className="col-3 bg-warning text-center rounded shadow-lg text-light pt-2 pb-2">*/}
                                {/*RETURN*/}
                            {/*</div>*/}
                        {/*</a>*/}
                        <form className="col-12" onSubmit={this.handleForSignWithSecretKey}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Secret key</span>
                                    <input id='showOrHidden' required='required' className="col-7 text-center p-2" placeholder="SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" type="password" onChange={this.handleChange}/>
                                    <a className='col-1 text-center bg-warning rounded-right text-light' onMouseDown={this.showPass} onMouseUp={this.hidePass}><FontAwesomeIcon className="mt-3 col-12 pr-0 pl-0" icon={faEye}/></a>
                                    <a target='_blank' href={'https://www.stellar.org/laboratory/#xdr-viewer?input=' + this.fixEscape(this.state.xdr)} className='col-1 text-center text-light pr-0'><div className='col-12  pt-2 pb-2 rounded  bg-warning border border-warning pr-0 pl-0'>XDR</div></a>
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
                        <h4 className="col-12 text-light text-center mt-5 mb-5">Exchange XLM to XIR</h4>
                        <div className="col-12 text-center text-light p-2">Your transaction has been done successfully.</div>
                        <div className="col-12 text-center text-light p-2 mt-3">Your transaction hash : <a target='_blank' href={'https://horizon-testnet.stellar.org/transactions/' + this.state.hash}>{this.state.hash}</a></div>
                        <a href="../Components/Dashboard" className='col-sm-4 col-12 text-center text-light pt-2 pb-2 mt-3 bg-warning mx-auto rounded shadow-lg'>Back to dashboard</a>
                    </div>
                </div>
            );
        }
    }
}
export default ExchangeXir;