import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEye} from '@fortawesome/free-solid-svg-icons';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';
import NumberFormat from 'react-number-format';
import InputMask from 'react-input-mask';
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
        this.showPass = this.showPass.bind(this);
        this.hidePass = this.hidePass.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleForSignWithSecretKey = this.handleForSignWithSecretKey.bind(this);
        // this.return = this.return.bind(this);
        this.state = {
            price: null,
            public_key:null,
            secret_key:'',
            data: '',
            sam: '',
            load1: false,
            load2: false,
            inValidSecretKey: false,
            key: 0,
            userAmount: false,
        }
    }

    // return(e)
    // {
    //     e.preventDefault();
    //     window.location.replace('/Components/WithdrawedXirWithSheba');
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


        if(e.target.name === "amount"){
            let amount =  parseFloat(e.target.value.replace(/,/g, ''));
            var url= `${this.Auth.domain}/user/convert?type=XIRTOIRR&amount=` + amount;
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.Auth.getToken()}`,
            };
            var config = { headers };
            return axios.get(url, config)
                .then(response =>{
                    this.setState({
                        rial: response.data.result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
        // const url = this.Auth.getDomain() + '/user/bank-account';
        // const headers = {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${this.Auth.getToken()}`,
        // };
        // var config = { headers };
        const urlPublic = this.Auth.getDomain() + '/user/account';
        const headersPublic = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configPublic = { headers: headersPublic };
        return axios.all([
            // axios.get(url, config)
            //     .then(response => {
            //         this.setState({
            //             sheba: response.data[1].sheba
            //         });
            //         this.shebaInfo(response.data[1].sheba);
            //     }),
            axios.get(urlPublic, configPublic)
                .then(response => {
                    this.setState({
                        public_key: response.data[0].public_key
                    });
                    this.assetAmount(this.state.public_key);
                })
        ]);
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

    withdrawInfo(x){
        const url = `${this.Auth.domain}/user/stellar/withdraw`;
        const formData = {
            amount: parseFloat(this.state.amount.replace(/,/g, '')),
            public_key: this.state.public_key,
            sheba: x,
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
                    load1: false,
                    max: err.response.data.error,
                });
            })
    }

    handleFormSubmit(e) {
        e.preventDefault();
        if(parseFloat(this.state.amount.replace(/,/g, '')) >= 10000 && parseFloat(this.state.amount.replace(/,/g, '')) <= this.state.xirBalance)
        {
            this.setState({
                load1: !this.state.load1
            });
            console.log(this.state.sheba.replace(/-/g, ''));
            let sheba = this.state.sheba.replace(/-/g, '');
            const url = this.Auth.getDomain() + '/user/bank/get-sheba-info';
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.Auth.getToken()}`,
            };
            var config = { headers };
            return axios.get(url + "?sheba="+ sheba , config)
                .then(response => {
                    this.setState({
                        first_name: response.data.Data.AccountOwners[0].FirstName,
                        last_name: response.data.Data.AccountOwners[0].LastName,
                    });
                    this.withdrawInfo(sheba);
                })
                .catch(err =>{
                    this.setState({
                        sheba_error: err.response.data.message,
                        load1: false
                    });
                });
        }
        else
        {
            this.setState({
                userAmount: true,
            })
        }
    }

    handleForSignWithSecretKey(e){
        e.preventDefault();
        if (!isValidSecretKey(this.state.secret_key)) {
            this.setState({
                inValidSecretKey: true,
                failed: ''
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
                });
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
                })
            })
    }

    fixEscape(str)
    {
        return encodeURIComponent(str) ;
    }

    render() {
        let error = '';
        if(this.state.sheba_error)
        {
            error = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your bank account invalid
                </div>
            </div>;
        }
        let priceXlm = '';
        if(this.state.xirBalance)
        {
            priceXlm = parseInt(this.state.xirBalance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' XIR';
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
        if(!this.state.xdr && !this.state.hash)
        {
            return(
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 alireza">
                            <div className="col-sm-8 col-12 clearfix mx-auto mt-3 mb-5">
                                <div className="row">
                                    {error}
                                    {failAmount}
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
                                                <div className="col-12 mt-2 text-center">To withdraw XIR,</div>
                                                <div className="col-12 mt-2 mb-2 text-center">enter the amount of XIR you are going to withdraw and sheba no. for the destination bank account.</div>
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
                                            <div className="col-sm-1 d-none d-sm-block icon8"> </div>
                                            <div className="col-sm-11 pl-0 d-none d-sm-block small font-weight-bold">Withdraw XIR to bank account</div>
                                            <div className="col-12 d-sm-none d-bolck small font-weight-bold">Withdraw XIR to bank account</div>
                                        </div>
                                    </div>
                                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                                        <div className='col-12 text-center mt-3 small font-weight-bold'>Available : {priceXlm}</div>
                                        <label className="col-12 mt-3">
                                            <div className="row">
                                                <span className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Amount XIR (Exir) :</span>
                                                {/*<input className="col-9 text-center rounded-right p-2" placeholder="" name="amount" minLength="5" type="tel" onChange={this.handleChange}/>*/}
                                                <NumberFormat required='required' className="col-sm-9 col-12 input2 text-center rounded pt-1 pb-1" thousandSeparator={true} minLength="5" name="amount" onChange={this.handleChange} />
                                            </div>
                                        </label>
                                        <label className="col-12 mt-3">
                                            <div className="row">
                                                <span className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Destination account (Sheba)</span>
                                                {/*<input required='required' className="col-9 text-center rounded-right p-2 text-light" name="sheba" type="text" onChange={this.handleChange}/>*/}
                                                <InputMask maskChar="*" placeholder="IR-****-****-****-****-****-****" mask="IR-9999-9999-9999-9999-9999-9999" required='required' className="col-sm-9 input2 col-12 text-center rounded pt-1 pb-1" name="sheba" type="text" onChange={this.handleChange}/>
                                            </div>
                                        </label>
                                        <label className="col-12 mt-3">
                                            <div className="row">
                                                <span className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Amount will be IRR (Rial) :</span>
                                                <div className="col-sm-9 col-12 text-center rounded pt-1 pb-1 border-div2">  {this.state.rial}  </div>
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
        }
        else if(this.state.xdr && !this.state.hash)
        {
            return(
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
                                                <div className="col-12 mt-2 text-center">Sheba : {this.state.sheba}</div>
                                                <div className="col-12 mt-2 text-center">First Name : {this.state.first_name}</div>
                                                <div className="col-12 mt-2 text-center">Last Name : {this.state.last_name}</div>
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
                                            <div className="col-sm-1 d-none d-sm-block icon8"> </div>
                                            <div className="col-sm-11 d-none d-sm-block pl-0 small font-weight-bold">Withdraw XIR to bank account</div>
                                            <div className="col-12 d-sm-none d-block small font-weight-bold">Withdraw XIR to bank account</div>
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
                                                <input required='required' id='showOrHidden' className="col-8 pt-1 pb-1 text-center input2 rounded-left" placeholder="SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" type="password" onChange={this.handleChange}/>
                                                <a className='col-sm-1 col-2 pt-1 pb-1 text-center bg-warning text-light' onMouseDown={this.showPass} onMouseUp={this.hidePass}><FontAwesomeIcon className="col-12 pr-0 pl-0" icon={faEye}/></a>
                                                <a target='_blank' href={'https://www.stellar.org/laboratory/#xdr-viewer?input=' + this.fixEscape(this.state.xdr)} className='col-sm-1 col-2 text-center text-light pr-0 pl-0 pt-2 pb-2 small font-weight-bold rounded-right bg-warning click-border'>XDR</a>
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
        }
        else if(this.state.hash)
        {
            return(
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
                                            <div className="col-sm-1 d-sm-block d-none icon8"> </div>
                                            <div className="col-sm-11 d-sm-block d-none pl-0 small font-weight-bold">Withdraw XIR to bank account</div>
                                            <div className="col-12 d-sm-none d-block small font-weight-bold">Withdraw XIR to bank account</div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <div className="row">
                                            <div className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Your transaction hash :</div>
                                            <a className="col-sm-9 col-12 pt-1 pb-1 word-wrap" target='_blank' href={'https://horizon-testnet.stellar.org/transactions/' + this.state.hash}>{this.state.hash}</a>
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
export default WithdrawedXirWithSheba;

// Your order has been registred and will be processed whitin few minutes.