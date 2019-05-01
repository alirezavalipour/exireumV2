import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faAngleLeft , faAngleRight , faEye} from '@fortawesome/free-solid-svg-icons';
import {Container, Row, Col} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class Orders extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.clickPrevButton = this.clickPrevButton.bind(this);
        this.clickNextButton = this.clickNextButton.bind(this);
        this.handleBill = this.handleBill.bind(this);
        this.handleExchange = this.handleExchange.bind(this);
        this.handleDeposit = this.handleDeposit.bind(this);
        this.handleWithdraw = this.handleWithdraw.bind(this);
        this.state = {}
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount() {
        const url = this.Auth.getDomain() + '/user/stellar/exchange';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    data1: response.data.data,
                    currentTab: 1,
                    currentPage: response.data.current_page
                });
                if (response.data.next_page_url) {
                    this.setState({
                        nextPage: response.data.next_page_url,
                    });
                }
                else
                {
                    this.setState({
                        nextPage: null,
                    });
                }
                if (response.data.prev_page_url) {
                    this.setState({
                        prevPage: response.data.prev_page_url,
                    });
                }
                else
                {
                    this.setState({
                        prevPage: null,
                    });
                }
            });
    }

    handleExchange(e) {
        e.preventDefault();
        e.currentTarget.setAttribute("class", "col-3 border-top border-right border-left border-warning pt-3 pb-3 font-weight-bold rounded-top");
        document.getElementById('bill').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        document.getElementById('deposit').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        document.getElementById('withdraw').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        const url = this.Auth.getDomain() + '/user/stellar/exchange';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    data1: response.data.data,
                    currentTab: 1,
                    currentPage: response.data.current_page
                });
                if (response.data.next_page_url) {
                    this.setState({
                        nextPage: response.data.next_page_url,
                    });
                    console.log(this.state.nextPage);
                }
                else
                {
                    this.setState({
                        nextPage: null,
                    });
                }
                if (response.data.prev_page_url) {
                    this.setState({
                        prevPage: response.data.prev_page_url,
                    });
                    console.log(this.state.prevPage);
                }
                else
                {
                    this.setState({
                        prevPage: null,
                    });
                }
            });
    }

    handleDeposit(e) {
        e.preventDefault();
        e.currentTarget.setAttribute("class", "col-3 border-top border-right border-left border-warning pt-3 pb-3 font-weight-bold rounded-top");
        document.getElementById('exchange').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        document.getElementById('bill').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        document.getElementById('withdraw').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        const url = this.Auth.getDomain() + '/user/deposit';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    data2: response.data.data,
                    currentTab: 2,
                    currentPage: response.data.current_page
                });
                if (response.data.next_page_url) {
                    this.setState({
                        nextPage: response.data.next_page_url,
                    });
                }
                else
                {
                    this.setState({
                        nextPage: null,
                    });
                }
                if (response.data.prev_page_url) {
                    this.setState({
                        prevPage: response.data.prev_page_url,
                    });
                }
                else
                {
                    this.setState({
                        prevPage: null,
                    });
                }
            });
    }

    handleWithdraw(e) {
        e.preventDefault();
        e.currentTarget.setAttribute("class", "col-3 border-top border-right border-left border-warning pt-3 pb-3 font-weight-bold rounded-top");
        document.getElementById('exchange').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        document.getElementById('deposit').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        document.getElementById('bill').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        const url = this.Auth.getDomain() + '/user/stellar/withdraw';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    data3: response.data.data,
                    currentTab: 3,
                    currentPage: response.data.current_page
                });
                console.log(response);
                if (response.data.next_page_url) {
                    this.setState({
                        nextPage: response.data.next_page_url,
                    });
                }
                else
                {
                    this.setState({
                        nextPage: null,
                    });
                }
                if (response.data.prev_page_url) {
                    this.setState({
                        prevPage: response.data.prev_page_url,
                    });
                }
                else
                {
                    this.setState({
                        prevPage: null,
                    });
                }
            });
    }

    handleBill(e) {
        e.preventDefault();
        e.currentTarget.setAttribute("class", "col-3 border-top border-right border-left border-warning pt-3 pb-3 font-weight-bold rounded-top");
        document.getElementById('exchange').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        document.getElementById('deposit').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        document.getElementById('withdraw').setAttribute("class","col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold");
        const url = this.Auth.getDomain() + '/user/bank/bill-payment';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    data4: response.data.data,
                    currentTab: 4,
                    currentPage: response.data.current_page
                });
                if (response.data.next_page_url) {
                    this.setState({
                        nextPage: response.data.next_page_url,
                    });
                }
                else
                {
                    this.setState({
                        nextPage: null,
                    });
                }
                if (response.data.prev_page_url) {
                    this.setState({
                        prevPage: response.data.prev_page_url,
                    });
                }
                else
                {
                    this.setState({
                        prevPage: null,
                    });
                }
            });
    }

    clickNextButton(e)
    {
        e.preventDefault();
        const url = this.state.nextPage;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                if(this.state.currentTab == 1)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data1: response.data.data,
                    });
                }
                if(this.state.currentTab == 2)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data2: response.data.data,
                    });
                }
                if(this.state.currentTab == 3)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data3: response.data.data,
                    });
                }
                if(this.state.currentTab == 4)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data4: response.data.data,
                    });
                }
                if (response.data.next_page_url) {
                    this.setState({
                        nextPage: response.data.next_page_url,
                    });
                }
                else
                {
                    this.setState({
                        nextPage: null,
                    });
                }
                if (response.data.prev_page_url) {
                    this.setState({
                        prevPage: response.data.prev_page_url,
                    });
                }
                else
                {
                    this.setState({
                        prevPage: null,
                    });
                }
            });
    }

    clickPrevButton(e)
    {
        e.preventDefault();
        const url = this.state.prevPage;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                if(this.state.currentTab == 1)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data1: response.data.data,
                    });
                }
                if(this.state.currentTab == 2)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data2: response.data.data,
                    });
                }
                if(this.state.currentTab == 3)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data3: response.data.data,
                    });
                }
                if(this.state.currentTab == 4)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data4: response.data.data,
                    });
                }
                if (response.data.next_page_url) {
                    this.setState({
                        nextPage: response.data.next_page_url,
                    });
                }
                else
                {
                    this.setState({
                        nextPage: null,
                    });
                }
                if (response.data.prev_page_url) {
                    this.setState({
                        prevPage: response.data.prev_page_url,
                    });
                }
                else
                {
                    this.setState({
                        prevPage: null,
                    });
                }
            });
    }

    render() {
        let leftButton= "";
        if(this.state.nextPage)
        {
            leftButton = <button onClick={this.clickNextButton} className="rounded shadow-lg border border-warning">
                <FontAwesomeIcon className="" icon={faAngleLeft}/>
            </button>;
        }
        let rightButton= "";
        if(this.state.prevPage)
        {
            rightButton = <button onClick={this.clickPrevButton} className="rounded shadow-lg border border-warning">
                <FontAwesomeIcon className="" icon={faAngleRight}/>
            </button>;
        }
        let attr = <div className="row">
            <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Id</div>
            <div className="col-2 text-center text-light pt-2 pb-2 pr-1 pl-1">Date</div>
            <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Amount</div>
            <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Base asset</div>
            <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Counter asset</div>
            <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Receive amount</div>
            <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Payment status</div>
            <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Order status</div>
            <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Transaction</div>
            <div className="col-2 text-center text-light pt-2 pb-2 pr-1 pl-1">Paid transaction</div>
        </div>;
        if(this.state.currentTab == 1)
        {
            attr = <div className="row">
                <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Id</div>
                <div className="col-2 text-center text-light pt-2 pb-2 pr-1 pl-1">Date</div>
                <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Amount</div>
                <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Base asset</div>
                <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Counter asset</div>
                <div className="col-2 text-center text-light pt-2 pb-2 pr-1 pl-1">Receive amount</div>
                <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Payment status</div>
                <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Order status</div>
                <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Transaction</div>
                <div className="col-1 text-center text-light pt-2 pb-2 pr-1 pl-1">Paid transaction</div>
            </div>;
        }
        if(this.state.currentTab == 2)
        {
            attr = <div className="row">
                <div className="col-3 text-center text-light pt-2 pb-2">Id</div>
                <div className="col-3 text-center text-light pt-2 pb-2">Amount</div>
                <div className="col-3 text-center text-light pt-2 pb-2">Price</div>
                <div className="col-3 text-center text-light pt-2 pb-2">Status</div>
            </div>;
        }
        if(this.state.currentTab == 3)
        {
            attr = <div className="row">
                <div className="col-1 text-center text-light pt-2 pb-2">Id</div>
                <div className="col-2 text-center text-light pt-2 pb-2">Date</div>
                <div className="col-1 text-center text-light pt-2 pb-2">Amount</div>
                <div className="col-1 text-center text-light pt-2 pb-2">Receive amount</div>
                <div className="col-3 text-center text-light pt-2 pb-2">Bank account</div>
                <div className="col-1 text-center text-light pt-2 pb-2">Payment status</div>
                <div className="col-1 text-center text-light pt-2 pb-2">Order status</div>
                <div className="col-1 text-center text-light pt-2 pb-2">transaction</div>
                <div className="col-1 text-center text-light pt-2 pb-2">Tracking code</div>
            </div>;
        }
        if(this.state.currentTab == 4)
        {
            attr = <div className="row">
                <div className="col-1 text-center text-light pt-2 pb-2">Id</div>
                <div className="col-2 text-center text-light pt-2 pb-2">Date</div>
                <div className="col-1 text-center text-light pt-2 pb-2">Amount</div>
                <div className="col-1 text-center text-light pt-2 pb-2">Payment code</div>
                <div className="col-2 text-center text-light pt-2 pb-2">Billing code</div>
                <div className="col-2 text-center text-light pt-2 pb-2">Payment status</div>
                <div className="col-1 text-center text-light pt-2 pb-2">Order status</div>
                <div className="col-1 text-center text-light pt-2 pb-2">transaction</div>
                <div className="col-1 text-center text-light pt-2 pb-2">Tracking code</div>
            </div>;
        }
        let signers = null;
        if (this.state.data1 && this.state.currentTab == 1) {
            signers = this.state.data1.map((elem , index) => {
                let id = elem.id;
                let amount = elem.amount;
                let base_asset = elem.base_asset;
                let counter_asset = elem.counter_asset;
                let date = elem.created_at;
                let receive_amount = elem.receive_amount;
                if(base_asset == 'XIR')
                {
                    receive_amount = parseInt(receive_amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                else
                {
                    receive_amount = (parseFloat(receive_amount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                // let type = elem.type;
                // const request = () => {
                //     switch (type) {
                //         case 0:
                //             return <div>Order type : Create account</div>;
                //         case 1:
                //             return <div>Order type : Add account</div>;
                //         case 2:
                //             return <div>Order type : Deposit</div>;
                //         case 3:
                //             return <div>Order type : Exchange</div>;
                //         case 4:
                //             return <div>Order type : Bill payment</div>;
                //         case 5:
                //             return <div>Order type : Withdraw</div>;
                //         case 6:
                //             return <div>Order type : Withdraw</div>;
                //     }
                // };
                let hash = elem.hash;
                let hash_paid = elem.paid_hash;
                let status = hash;
                if (!status)
                {
                    status = 'Rejected';
                }
                else if (status)
                {
                    status = 'Successful';
                }
                let order_status = elem.order.order_status.value;
                if (order_status == 1)
                {
                    order_status = 'Pending'
                }
                else if (order_status == 2)
                {
                    order_status = 'Done'
                }
                else if (order_status == 0 || order_status == 3)
                {
                    order_status = 'Rejected'
                }
                return <div key={index} className="row" style={{backgroundColor: (index%2 === 0 ? '#ffc107' : '#151d2e')}}>
                    <div className="col-1 text-center text-light pt-2 pb-2">{id}</div>
                    <div className="col-2 text-center text-light pt-2 pb-2">{date}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{amount}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{base_asset}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{counter_asset}</div>
                    <div className="col-2 text-center text-light pt-2 pb-2">{receive_amount}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{status}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{order_status}</div>
                    <a target='_blank' href={"https://horizon-testnet.stellar.org/transactions/" + hash} className="col-1 text-center text-light pt-2 pb-2"><FontAwesomeIcon className="" icon={faEye}/></a>
                    <a target='_blank' href={"https://horizon-testnet.stellar.org/transactions/" + hash_paid} className="col-1 text-center text-light pt-2 pb-2"><FontAwesomeIcon className="" icon={faEye}/></a>
                </div>;
            });
        }
        if (this.state.data2 && this.state.currentTab == 2) {
            signers = this.state.data2.map((elem , index) => {
                let id = elem.id;
                let amount = elem.amount;
                let price = elem.price;
                // let type = elem.type;
                // const request = () => {
                //     switch (type) {
                //         case 0:
                //             return <div>Order type : Create account</div>;
                //         case 1:
                //             return <div>Order type : Add account</div>;
                //         case 2:
                //             return <div>Order type : Deposit</div>;
                //         case 3:
                //             return <div>Order type : Exchange</div>;
                //         case 4:
                //             return <div>Order type : Bill payment</div>;
                //         case 5:
                //             return <div>Order type : Withdraw</div>;
                //         case 6:
                //             return <div>Order type : Withdraw</div>;
                //     }
                // };
                let status = elem.hash;
                if (!status)
                {
                    status = 'Rejected';
                }
                else if (status)
                {
                    status = 'Successful';
                }
                return <div key={index} className="row" style={{backgroundColor: (index%2 === 0 ? '#ffc107' : '#151d2e')}}>
                    {/*<div className="col-4 text-center text-light pt-2 pb-2">{request()}</div>*/}
                    <div className="col-3 text-center text-light pt-2 pb-2">{id}</div>
                    <div className="col-3 text-center text-light pt-2 pb-2">{amount}</div>
                    <div className="col-3 text-center text-light pt-2 pb-2">{price}</div>
                    <div className="col-3 text-center text-light pt-2 pb-2">{status}</div>
                </div>;
            });
        }
        if (this.state.data3 && this.state.currentTab == 3) {
            signers = this.state.data3.map((elem , index) => {
                let id = elem.id;
                let amount = (elem.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let billing_code = elem.billing_code;
                let payment_code = elem.payment_code;
                let receive_amount = (elem.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                // let type = elem.type;
                // const request = () => {
                //     switch (type) {
                //         case 0:
                //             return <div>Order type : Create account</div>;
                //         case 1:
                //             return <div>Order type : Add account</div>;
                //         case 2:
                //             return <div>Order type : Deposit</div>;
                //         case 3:
                //             return <div>Order type : Exchange</div>;
                //         case 4:
                //             return <div>Order type : Bill payment</div>;
                //         case 5:
                //             return <div>Order type : Withdraw</div>;
                //         case 6:
                //             return <div>Order type : Withdraw</div>;
                //     }
                // };
                let date = elem.created_at;
                let bank_account = elem.bank_account.sheba;
                let hash_paid = elem.tracking_code;
                let hash = elem.hash;
                let status = hash;
                if (!status)
                {
                    status = 'Rejected';
                }
                else if (status)
                {
                    status = 'Successful';
                }
                let order_status = elem.order.order_status.value;
                if (order_status == 1)
                {
                    order_status = 'Pending'
                }
                else if (order_status == 2)
                {
                    order_status = 'Done'
                }
                else if (order_status == 0 || order_status == 3)
                {
                    order_status = 'Rejected'
                }
                return <div key={index} className="row" style={{backgroundColor: (index%2 === 0 ? '#ffc107' : '#151d2e')}}>
                    <div className="col-1 text-center text-light pt-2 pb-2">{id}</div>
                    <div className="col-2 text-center text-light pt-2 pb-2">{date}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{amount}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{receive_amount}</div>
                    <div className="col-3 text-center text-light pt-2 pb-2">{bank_account}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{status}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{order_status}</div>
                    <a target='_blank' href={"https://horizon-testnet.stellar.org/transactions/" + hash} className="col-1 text-center text-light pt-2 pb-2"><FontAwesomeIcon className="" icon={faEye}/></a>
                    <a target='_blank' href={"https://horizon-testnet.stellar.org/transactions/" + hash_paid} className="col-1 text-center text-light pt-2 pb-2"><FontAwesomeIcon className="" icon={faEye}/></a>
                </div>;
            });
        }
        if (this.state.data4 && this.state.currentTab == 4) {
            signers = this.state.data4.map((elem , index) => {
                let id = elem.id;
                let amount = elem.amount;
                let billing_code = elem.billing_code;
                let payment_code = elem.payment_code;
                // let type = elem.type;
                // const request = () => {
                //     switch (type) {
                //         case 0:
                //             return <div>Order type : Create account</div>;
                //         case 1:
                //             return <div>Order type : Add account</div>;
                //         case 2:
                //             return <div>Order type : Deposit</div>;
                //         case 3:
                //             return <div>Order type : Exchange</div>;
                //         case 4:
                //             return <div>Order type : Bill payment</div>;
                //         case 5:
                //             return <div>Order type : Withdraw</div>;
                //         case 6:
                //             return <div>Order type : Withdraw</div>;
                //     }
                // };
                let hash_paid = elem.tracking_code;
                let date = elem.created_at;
                let hash = elem.hash;
                let status = hash;
                if (!status)
                {
                    status = 'Rejected';
                }
                else if (status)
                {
                    status = 'Successful';
                }
                let order_status = elem.order.order_status.value;
                if (order_status == 1)
                {
                    order_status = 'Pending'
                }
                else if (order_status == 2)
                {
                    order_status = 'Done'
                }
                else if (order_status == 0 || order_status == 3)
                {
                    order_status = 'Rejected'
                }
                return <div key={index} className="row" style={{backgroundColor: (index%2 === 0 ? '#ffc107' : '#151d2e')}}>
                    <div className="col-1 text-center text-light pt-2 pb-2">{id}</div>
                    <div className="col-2 text-center text-light pt-2 pb-2">{date}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{amount}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{payment_code}</div>
                    <div className="col-2 text-center text-light pt-2 pb-2">{billing_code}</div>
                    <div className="col-2 text-center text-light pt-2 pb-2">{status}</div>
                    <div className="col-1 text-center text-light pt-2 pb-2">{order_status}</div>
                    <a target='_blank' href={"https://horizon-testnet.stellar.org/transactions/" + hash} className="col-1 text-center text-light pt-2 pb-2"><FontAwesomeIcon className="" icon={faEye}/></a>
                    <a target='_blank' href={"https://horizon-testnet.stellar.org/transactions/" + hash_paid} className="col-1 text-center text-light pt-2 pb-2"><FontAwesomeIcon className="" icon={faEye}/></a>
                </div>;
            });
        }
        return(
            <div className="col-sm-11 col-12 clearfix mx-auto">
                <div className="row">
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Orders</h2>
                    <div className="col-12 border-bottom border-warning rounded shadow-lg">
                        <div className="row">
                            <div className="col-12 col-12 text-center text-light">
                                <div className="row ">
                                    <a id="exchange" onClick={this.handleExchange} className="col-3 border-top border-right border-left border-warning pt-3 pb-3 font-weight-bold rounded-top">Exchange</a>
                                    <a id="deposit" onClick={this.handleDeposit} className="col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold">Deposit</a>
                                    <a id="withdraw" onClick={this.handleWithdraw} className="col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold">Withdraw</a>
                                    <a id="bill" onClick={this.handleBill} className="col-3 border-bottom border-warning pt-3 pb-3 font-weight-bold">Bill payment</a>
                                </div>
                            </div>
                            {/*<div className="col-12 text-center text-light border-bottom border-warning">*/}
                                {/*<div className="row">*/}
                                    {/*<div className="col-3 pt-2 pb-2 font-weight-bold">Status</div>*/}
                                    {/*<div className="col-3 border-left border-warning pt-2 pb-2 font-weight-bold">Order type</div>*/}
                                    {/*<div className="col-3 border-left border-warning pt-2 pb-2 font-weight-bold">Amount</div>*/}
                                    {/*<div className="col-3 border-left border-warning pt-2 pb-2 font-weight-bold">Id</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            <div className="col-12 border-left border-right border-warning">
                                <div className="col-12 mt-4">{attr}</div>
                                <div className="col-12 mt-2 mb-4">{signers}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-3 text-center text-light mb-3">
                        <div className="row">
                            <div className="col-5 text-right">{leftButton}</div>
                            <div className="col-2 text-center border border-warning rounded shadow-lg pr-0 pl-0">{this.state.currentPage}</div>
                            <div className="col-5 text-left">{rightButton}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Orders;