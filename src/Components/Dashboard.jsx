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
        this.state = {}
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
                            xirBalance: elem.balance
                        });
                    }
                    if(elem.asset_type=="native")
                    {
                        this.setState({
                            xlmBalance: elem.balance
                        });
                    }
                });
            });
    }

    render() {
        return (
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
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
