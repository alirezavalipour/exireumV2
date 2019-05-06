import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {faArrowCircleRight} from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col } from 'bootstrap-4-react';
import Register from "./Register";
import NumberFormat from 'react-number-format';
import AuthService from "./AuthService";

class Dashboard extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.assetAmount = this.assetAmount.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleConvertRate = this.handleConvertRate.bind(this);
        this.convert = this.convert.bind(this);
        this.state = {
            formSelect1: '',
            formSelect2: '',
        }
    }

    handleChange1(e)
    {
        this.setState({
            formSelect1: e.target.value,
        });
    }

    handleChange2(e)
    {
        this.setState({
            formSelect2: e.target.value,
        });
    }

    handleConvertRate(e)
    {
        this.setState({
            [e.target.name]:e.target.value,
        });
    }

    convert(e)
    {
        e.preventDefault();
        var url = `${this.Auth.domain}/user/convert?type=` + this.state.formSelect1 + `TO` + this.state.formSelect2 + `&amount=` + this.state.amount.replace(/,/g, '');
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    price: (parseFloat(response.data.result).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                });
            });
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
        var config = { headers };
        return axios.get(url, config)
            .then(response => {
                this.assetAmount(response.data[0].public_key);
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
                    if(elem.asset_code=="XIR")
                    {
                        this.setState({
                            xirBalance: (parseInt(elem.balance)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        });
                    }
                    if(elem.asset_type=="native")
                    {
                        this.setState({
                            xlmBalances: elem.balance,
                            xlmBalance: (parseFloat(elem.balance).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        });
                    }
                });
            });
    }

    render() {
    let priceXlm = '';
    if(this.state.xlmBalance)
    {
        priceXlm = (parseFloat((this.state.xlmBalances) - (0.5 * this.state.entry) - 1).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' XLM';
    }
    let option = <select className="font-weight-bold col-3 pt-2 pb-2 rounded-right bg-warning text-center border border-warning text-light pr-1 pl-1" name="type" onChange={this.handleChange2}>
            <option>-</option>
            <option type="0">XLM</option>
            <option type="1">XIR</option>
            <option type="2">IRR</option>
        </select>;
        if(this.state.formSelect1 == 'XLM')
        {
            option = <select className="font-weight-bold col-3 pt-2 pb-2 rounded-right bg-warning text-center border border-warning text-light pr-1 pl-1" name="type" onChange={this.handleChange2}>
                <option>-</option>
                <option type="1">XIR</option>
                <option type="2">IRR</option>
            </select>;
        }
        if(this.state.formSelect1 == 'XIR')
        {
            option = <select className="font-weight-bold col-3 pt-2 pb-2 rounded-right bg-warning text-center border border-warning text-light pr-1 pl-1" name="type" onChange={this.handleChange2}>
                <option>-</option>
                <option type="0">XLM</option>
                <option type="2">IRR</option>
            </select>;
        }
        if(this.state.formSelect1 == 'IRR')
        {
            option = <select className="font-weight-bold col-3 pt-2 pb-2 rounded-right bg-warning text-center border border-warning text-light pr-1 pl-1" name="type" onChange={this.handleChange2}>
                <option>-</option>
                <option type="0">XLM</option>
                <option type="1">XIR</option>
            </select>;
        }
        return (
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <div className="col-12">
                        <div className="col-12 mx-auto">
                            <div className="row">
                                <h5 className="col-12 text-center text-light">Convert rate</h5>
                                <div className="col-sm-5 col-12 mt-3 mb-5">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-4 pt-2 pb-2 text-center text-light border-div rounded-left pr-1 pl-1 bg-warning">Base asset</div>
                                            <NumberFormat thousandSeparator={true} className="col-5 pt-2 pb-2 text-center" name="amount" type="text" onChange={this.handleConvertRate}/>
                                            <select className="font-weight-bold col-3 pt-2 pb-2 rounded-right bg-warning text-center border border-warning text-light pr-1 pl-1" name="type" onChange={this.handleChange1}>
                                                <option>-</option>
                                                <option type="0">XLM</option>
                                                <option type="1">XIR</option>
                                                <option type="2">IRR</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <a onClick={this.convert} className="col-sm-2 col-12 mt-3 mb-5 text-center text-light font-weight-bold rounded"><div className="col-6 pt-2 pb-2 rounded bg-warning mx-auto" style={{height: '100%'}}><FontAwesomeIcon className="font-weight-bold bg-warning mt-1" style={{fontSize: '22px', width: '100%'}} icon={faArrowCircleRight}/></div></a>
                                <div className="col-sm-5 col-12 mt-3 mb-5">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-4 pt-2 pb-2 text-center text-light border-div rounded-left pr-1 pl-1 bg-warning">Counter asset</div>
                                            <div className="col-5 pt-2 pb-2 text-center border-div text-light">{this.state.price}</div>
                                            {option}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-5 col-12 text-center">
                        <div className="row">
                            <h2 className="col-12 mb-2 font-weight-bold text-light">XIR</h2>
                            <h5 className="col-12 mb-2 text-light">Balance : {this.state.xirBalance} XIR</h5>
                            <div className="col-12 mb-5 text-light">Available : {this.state.xirBalance} XIR</div>
                            {/*<div className="col-12">*/}
                                {/*<div className="row">*/}
                                    {/*<div className="col-6">Remind of XIR :</div>*/}
                                    {/*<div className="col-6">10000</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            <a href="/Components/ExchangeXir" className="hover-div col-12 border-div p-2 rounded shadow-lg">Exchange XIR to XLM</a>
                            <a href="/Components/DepositXirWithQr" className="hover-div col-12 border-div p-2 mt-3 rounded shadow-lg">Deposit XIR with QR</a>
                            <a href="/Components/DepositXirWithIpg" className="hover-div col-12 border-div p-2 mt-3 rounded shadow-lg">Deposit XIR With IPG</a>
                            <a href="/Components/WithdrawedXirWithSheba" className="hover-div col-12 border-div p-2 mt-3 rounded shadow-lg">Withdraw XIR to bank account</a>
                            <a href="/Components/SendXir" className="hover-div col-12 border-div p-2 mt-3 rounded shadow-lg">Send XIR</a>
                            <a href="/Components/PayingTheBill" className="hover-div col-12 border-div p-2 mt-3 rounded shadow-lg mb-3">Paying the bill</a>
                        </div>
                    </div>
                    <div className="col-sm-2 col-12"></div>
                    <div className="col-sm-5 col-12 text-center">
                        <div className="row">
                            <h2 className="col-12 mb-2 font-weight-bold text-light">XLM</h2>
                            <h5 className="col-12 mb-2 text-light">Balance : {this.state.xlmBalance} XLM</h5>
                            <div className="col-12 mb-5 text-light">Available : {priceXlm}</div>
                            {/*<div className="col-12">*/}
                                {/*<div className="row">*/}
                                    {/*<div className="col-6">Remind of XLM :</div>*/}
                                    {/*<div className="col-6">10000</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            <a href="/Components/ExchangeXlm" className="div-hover col-12 border-div p-2 rounded shadow-lg">Exchange XLM to XIR</a>
                            <a href="/Components/DepositXlm" className="div-hover col-12 border-div p-2 mt-3 rounded shadow-lg">Deposit XLM</a>
                            <a href="/Components/SendXlm" className="div-hover col-12 border-div p-2 mt-3 rounded shadow-lg">Send XLM</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
