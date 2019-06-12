import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons';
import {} from 'bootstrap-4-react';
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
                let trustFlag = false;
                res.data.balances.map(elem =>{
                    if(elem.asset_code=="XIR")
                    {
                        trustFlag = true;
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
                if (!trustFlag)
                {
                    window.location.replace('/Components/Trust');
                }
            });
    }

    render() {
    let priceXlm = '';
    if(this.state.xlmBalance)
    {
        priceXlm = (parseFloat((this.state.xlmBalances) - (0.5 * this.state.entry) - 1).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' XLM';
    }
    let option = <select className="font-weight-bold col-12 mt-3 mb-3 text-center text-light select-color pt-1 pb-1 rounded" name="type" onChange={this.handleChange2}>
            <option>-</option>
            <option type="0">XLM</option>
            <option type="1">XIR</option>
            <option type="2">IRR</option>
        </select>;
        if(this.state.formSelect1 == 'XLM')
        {
            option = <select className="font-weight-bold col-12 mt-3 mb-3 text-center text-light select-color pt-1 pb-1 rounded" name="type" onChange={this.handleChange2}>
                <option>-</option>
                <option type="1">XIR</option>
                <option type="2">IRR</option>
            </select>;
        }
        if(this.state.formSelect1 == 'XIR')
        {
            option = <select className="font-weight-bold col-12 mt-3 mb-3 text-center text-light select-color pt-1 pb-1 rounded" name="type" onChange={this.handleChange2}>
                <option>-</option>
                <option type="0">XLM</option>
                <option type="2">IRR</option>
            </select>;
        }
        if(this.state.formSelect1 == 'IRR')
        {
            option = <select className="font-weight-bold col-12 mt-3 mb-3 text-center text-light select-color pt-1 pb-1 rounded" name="type" onChange={this.handleChange2}>
                <option>-</option>
                <option type="0">XLM</option>
                <option type="1">XIR</option>
            </select>;
        }
        return (
            <div className="col-12">
                <div className="row">
                    <div className="col-12 alireza pr-0 pl-0">
                        <div className="col-sm-9 col-12 mx-auto mb-5">
                            <div className="row">
                                <h5 className="col-12 text-center text-warning font-weight-bold mb-5">Convert rate</h5>
                                <div className="col-sm-6 col-12 div-tab1 mt-1 mb-1">
                                    <div className="col-12 border-tab rounded tab-color pt-3 pb-3 pr-4">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12 col-sm-6 text-center mt-3">
                                                    <div className="row">
                                                        <h2 className="col-12 font-weight-bold text-light">XIR</h2>
                                                        <div className="col-12 text-light mt-2">Balance : {this.state.xirBalance} XIR</div>
                                                        <div className="col-12 text-light small mt-3">Available : {this.state.xirBalance} XIR</div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 bg-warning rounded mt-3 mb-3">
                                                    <div className="col-12 text-center pt-3 pb-3 font-weight-bold">Base asset</div>
                                                    <NumberFormat className="col-12 text-center pt-1 pb-1 rounded2" thousandSeparator={true} name="amount" type="text" onChange={this.handleConvertRate}/>
                                                    <select className="col-12 mt-3 mb-3 text-center text-light select-color pt-1 pb-1 rounded font-weight-bold" name="type" onChange={this.handleChange1}>
                                                        <option>-</option>
                                                        <option type="0">XLM</option>
                                                        <option type="1">XIR</option>
                                                        <option type="2">IRR</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a className="text-center font-weight-bold bg-warning button-tab mx-auto" onClick={this.convert}>
                                    <FontAwesomeIcon icon={faExchangeAlt}/>
                                </a>
                                <div className="col-sm-6 col-12 div-tab2 mt-1 mb-1">
                                    <div className="col-12 border-tab tab-color pt-3 pb-3 rounded pl-4">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12 col-sm-6 bg-warning rounded mt-3 mb-3">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-12 text-center pt-3 pb-3 font-weight-bold">Counter asset</div>
                                                            <div className="col-12 text-center text-light pt-1 pb-1 bg-dark rounded border-div2">{this.state.price}</div>
                                                            {option}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 text-center mt-3">
                                                    <div className="row">
                                                        <h2 className="col-12 font-weight-bold text-light">XLM</h2>
                                                        <div className="col-12 text-light mt-2">Balance : {this.state.xlmBalance} XLM</div>
                                                        <div className="col-12 text-light small mt-3">Available : {priceXlm}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 bg-light pr-0 pl-0">
                        <div className="col-sm-9 col-12 mx-auto">
                            <div className="row">
                                <div className="col-sm-6 col-12 text-center border-right border-dark mb-3 mt-3 pb-3">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-sm-6 mt-3">
                                                <div className="col-12 div-tab1">
                                                    <div className="row">
                                                        <a href="/Components/ExchangeXir" className="hover-div col-12 border-div3 pt-3 pb-3 pr-0 pl-0 rounded shadow-lg small">Exchange XIR to XLM</a>
                                                        <a href="/Components/DepositXirWithQr" className="hover-div col-12 border-div3 pt-3 pb-3 pr-0 pl-0 mt-3 rounded shadow-lg small">Deposit XIR with QR</a>
                                                        <a href="/Components/SendXir" className="hover-div col-12 border-div3 pt-3 pb-3 mt-3 pr-0 pl-0 rounded shadow-lg small">Send XIR</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 mt-3">
                                                <div className="col-12 div-tab2">
                                                    <div className="row">
                                                        <a href="/Components/DepositXirWithIpg" className="hover-div col-12 border-div3 pt-3 pb-3 pr-0 pl-0 rounded shadow-lg small">Deposit XIR With IPG</a>
                                                        <a href="/Components/WithdrawedXirWithSheba" className="hover-div col-12 border-div3 pt-3 pb-3 pr-0 pl-0 mt-3 rounded shadow-lg small">Withdraw XIR to bank account</a>
                                                        <a href="/Components/PayingTheBill" className="hover-div col-12 border-div3 pt-3 pb-3 pr-0 pl-0 mt-3 rounded shadow-lg small">Paying the bill</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-12 text-center mb-3 mt-3">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-sm-6 mt-3">
                                                <div className="col-12 div-tab1">
                                                    <div className="row">
                                                        <a href="/Components/ExchangeXlm" className="div-hover col-12 border-div3 pt-3 pb-3 pr-0 pl-0 rounded shadow-lg small">Exchange XLM to XIR</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 mt-3">
                                                <div className="col-12 div-tab2">
                                                    <div className="row">
                                                        <a href="/Components/SendXlm" className="div-hover col-12 border-div3 pt-3 pb-3 pr-0 pl-0 rounded shadow-lg small">Send XLM</a>
                                                        <a href="/Components/DepositXlm" className="div-hover col-12 border-div3 pt-3 pb-3 pr-0 pl-0 mt-3 rounded shadow-lg small">Deposit XLM</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
