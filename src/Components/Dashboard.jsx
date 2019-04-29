import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import Register from "./Register";
import AuthService from "./AuthService";

class Dashboard extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.assetAmount = this.assetAmount.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleConvertRate = this.handleConvertRate.bind(this);
        this.state = {
            formSelect1: 'XLM',
            formSelect2: 'XLM',
        }
    }

    handleChange1(e)
    {
        this.setState({
            formSelect1: e.target.value,
        });
        console.log(this.state.formSelect1);
    }

    handleChange2(e)
    {
        this.setState({
            formSelect2: e.target.value,
        });
        console.log(this.state.formSelect2);
    }

    handleConvertRate(e)
    {
        this.setState({
            [e.target.name]:e.target.value,
        });
        if(e.target.name == "amount") {
            let amount = e.target.value;
            var url = `${this.Auth.domain}/user/convert?type=` + this.state.formSelect1 + `TO` + this.state.formSelect2 + `&amount=` + amount;
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.Auth.getToken()}`,
            };
            var config = {headers};
            return axios.get(url, config)
                .then(response => {
                    this.setState({
                        price: parseFloat(response.data.result).toFixed(2)
                    });
                });
        }
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
                res.data.balances.map(elem =>{
                    if(elem.asset_code=="XIR")
                    {
                        this.setState({
                            xirBalance: (parseFloat(elem.balance).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        });
                    }
                    if(elem.asset_type=="native")
                    {
                        this.setState({
                            xlmBalance: (parseFloat(elem.balance).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        });
                    }
                });
            });
    }

    render() {
        return (
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <div className="col-12">
                        <div className="col-12 mx-auto">
                            <div className="row">
                                <div className="col-sm-5 col-12 mt-3 mb-3">
                                    <div className="col-12">
                                        <div className="row">
                                            <input className="col-6 pt-2 pb-2 rounded-left text-center" name="amount" type="text" onChange={this.handleConvertRate}/>
                                            <select className="col-6 pt-2 pb-2 rounded-right bg-warning text-center border border-warning text-light" name="type" onChange={this.handleChange1}>
                                                <option type="0">XLM</option>
                                                <option type="1">XIR</option>
                                                <option type="2">IRR</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-2 col-12 mt-3 mb-3 text-center text-light pt-2">Convert rate</div>
                                <div className="col-sm-5 col-12 mt-3 mb-3">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-6 pt-2 pb-2 rounded-left text-center border-div text-light" style={{height: '44px'}}>{this.state.price}</div>
                                            <select className="col-6 pt-2 pb-2 rounded-right bg-warning text-center border border-warning text-light" name="type" onChange={this.handleChange2}>
                                                <option type="0">XLM</option>
                                                <option type="1">XIR</option>
                                                <option type="2">IRR</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-5 col-12 text-center">
                        <div className="row">
                            <h2 className="col-12 mb-2 font-weight-bold text-light">XIR</h2>
                            <h5 className="col-12 mb-5 text-light">{this.state.xirBalance}</h5>
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
                            <a href="/Components/PayingTheBill" className="hover-div col-12 border-div p-2 mt-3 rounded shadow-lg">Paying the bill</a>
                        </div>
                    </div>
                    <div className="col-sm-2 col-12"></div>
                    <div className="col-sm-5 col-12 text-center">
                        <div className="row">
                            <h2 className="col-12 mb-2 font-weight-bold text-light">XLM</h2>
                            <h5 className="col-12 mb-5 text-light">{this.state.xlmBalance}</h5>
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
