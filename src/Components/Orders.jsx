import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faAngleLeft , faAngleRight , faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
import {} from 'bootstrap-4-react';
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
        this.handleSendXir = this.handleSendXir.bind(this);
        this.handleSendXlm = this.handleSendXlm.bind(this);
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
                    currentPage: response.data.current_page,
                    length1: response.data.data.length
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
        e.currentTarget.setAttribute("class", "col-sm-2 col-12 text-light border-right border-warning pt-2 pb-2 bg-warning small");
        document.getElementById('bill').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('deposit').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('withdraw').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('send-xir').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('send-xlm').setAttribute("class","col-sm-2 col-12 pt-2 pb-2 hover-tab small");
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
                    currentPage: response.data.current_page,
                    length1: response.data.data.length
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

    handleDeposit(e) {
        e.preventDefault();
        e.currentTarget.setAttribute("class", "col-sm-2 col-12 text-light border-right border-warning pt-2 pb-2 bg-warning small");
        document.getElementById('exchange').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('bill').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('withdraw').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('send-xir').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('send-xlm').setAttribute("class","col-sm-2 col-12 pt-2 pb-2 hover-tab small");
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
                    currentPage: response.data.current_page,
                    length2: response.data.data.length
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
        e.currentTarget.setAttribute("class", "col-sm-2 col-12 text-light border-right border-warning pt-2 pb-2 bg-warning small");
        document.getElementById('exchange').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('deposit').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('bill').setAttribute("class","col-sm-2 col-12 pt-2 border-right border-warning pb-2 hover-tab small");
        document.getElementById('send-xir').setAttribute("class","col-sm-2 col-12 pt-2 border-right border-warning pb-2 hover-tab small");
        document.getElementById('send-xlm').setAttribute("class","col-sm-2 col-12 pt-2 pb-2 hover-tab small");
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
                    currentPage: response.data.current_page,
                    length3: response.data.data.length
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

    handleBill(e) {
        e.preventDefault();
        e.currentTarget.setAttribute("class", "col-sm-2 col-12 text-light border-right border-warning pt-2 pb-2 bg-warning small");
        document.getElementById('exchange').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('deposit').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('withdraw').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('send-xir').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('send-xlm').setAttribute("class","col-sm-2 col-12 pt-2 pb-2 hover-tab small");
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
                    currentPage: response.data.current_page,
                    length4: response.data.data.length
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

    handleSendXir(e) {
        e.preventDefault();
        e.currentTarget.setAttribute("class", "col-sm-2 col-12 text-light border-right border-warning pt-2 pb-2 bg-warning small");
        document.getElementById('exchange').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('deposit').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('withdraw').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('bill').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('send-xlm').setAttribute("class","col-sm-2 col-12 pt-2 pb-2 hover-tab small");
        const url = this.Auth.getDomain() + '/user/stellar/send-xir';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    data5: response.data.data,
                    currentTab: 5,
                    currentPage: response.data.current_page,
                    length5: response.data.data.length
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

    handleSendXlm(e) {
        e.preventDefault();
        e.currentTarget.setAttribute("class", "col-sm-2 col-12 text-light border-right border-warning pt-2 pb-2 bg-warning small");
        document.getElementById('exchange').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('deposit').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('withdraw').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('bill').setAttribute("class","col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small");
        document.getElementById('send-xir').setAttribute("class","col-sm-2 border-right border-warning col-12 pt-2 pb-2 hover-tab small");
        const url = this.Auth.getDomain() + '/user/stellar/send-xlm';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    data6: response.data.data,
                    currentTab: 6,
                    currentPage: response.data.current_page,
                    length6: response.data.data.length
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
                if(this.state.currentTab === 1)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data1: response.data.data,
                    });
                }
                if(this.state.currentTab === 2)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data2: response.data.data,
                    });
                }
                if(this.state.currentTab === 3)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data3: response.data.data,
                    });
                }
                if(this.state.currentTab === 4)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data4: response.data.data,
                    });
                }
                if(this.state.currentTab === 5)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data5: response.data.data,
                    });
                }
                if(this.state.currentTab === 6)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data6: response.data.data,
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
                if(this.state.currentTab === 1)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data1: response.data.data,
                    });
                }
                if(this.state.currentTab === 2)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data2: response.data.data,
                    });
                }
                if(this.state.currentTab === 3)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data3: response.data.data,
                    });
                }
                if(this.state.currentTab === 4)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data4: response.data.data,
                    });
                }
                if(this.state.currentTab === 5)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data5: response.data.data,
                    });
                }
                if(this.state.currentTab === 6)
                {
                    this.setState({
                        currentPage: response.data.current_page,
                        data6: response.data.data,
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
            leftButton = <button onClick={this.clickNextButton} className="rounded shadow-lg bg-white text-secondary border border-warning">
                <FontAwesomeIcon className="" icon={faAngleLeft}/>
            </button>;
        }
        let rightButton= "";
        if(this.state.prevPage)
        {
            rightButton = <button onClick={this.clickPrevButton} className="rounded shadow-lg bg-white text-secondary border border-warning">
                <FontAwesomeIcon className="" icon={faAngleRight}/>
            </button>;
        }
        let attr = <div className="row smallText text-secondary">
            <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Date</div>
            <div className="col-sm-3 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Base Amount</div>
            <div className="col-sm-3 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Counter amount</div>
            <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Payment status</div>
            <div className="col-sm-2 col-12 text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Settlement status</div>
        </div>;
        if(this.state.currentTab === 1)
        {
            attr = <div className="row smallText text-secondary">
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Date</div>
                <div className="col-sm-3 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Base Amount</div>
                <div className="col-sm-3 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Counter Amount</div>
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Payment Status</div>
                <div className="col-sm-2 col-12 text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Settlement Status</div>
            </div>;
        }
        if(this.state.currentTab === 2)
        {
            attr = <div className="row smallText text-secondary">
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Date</div>
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Base Amount</div>
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Counter Amount</div>
                <div className="col-sm-3 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Payment Status</div>
                <div className="col-sm-3 col-12 text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Settlement Ref.</div>
            </div>;
        }
        if(this.state.currentTab === 3)
        {
            attr = <div className="row smallText text-secondary">
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Date</div>
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Base Amount</div>
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Counter Amount</div>
                <div className="col-sm-3 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Bank Account</div>
                <div className="col-sm-1 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Payment status</div>
                <div className="col-sm-2 col-12 text-center pt-2 pb-2 font-weight-bold">Settlement Ref.</div>
            </div>;
        }
        if(this.state.currentTab === 4)
        {
            attr = <div className="row smallText text-secondary">
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Date</div>
                <div className="col-sm-1 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Base Amount</div>
                <div className="col-sm-1 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Bill Amount</div>
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Billing Code</div>
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Payment Code</div>
                <div className="col-sm-2 col-12 border-right border-warning text-center pt-2 pb-2 font-weight-bold">Payment status</div>
                <div className="col-sm-2 col-12 text-center pt-2 pb-2">Bill Ref.</div>
            </div>;
        }
        if(this.state.currentTab === 5)
        {
            attr = <div className="row smallText text-secondary">
                <div className="col-sm-3 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Date</div>
                <div className="col-sm-3 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Amount</div>
                <div className="col-sm-6 col-12 text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Receiver</div>
            </div>;
        }
        if(this.state.currentTab === 6)
        {
            attr = <div className="row smallText text-secondary">
                <div className="col-sm-3 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Date</div>
                <div className="col-sm-3 col-12 border-right border-warning text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Amount</div>
                <div className="col-sm-6 col-12 text-center pt-2 pb-2 pr-1 pl-1 font-weight-bold">Receiver</div>
            </div>;
        }
        let signers = null;
        if (this.state.data1 && this.state.currentTab === 1 && this.state.length1 !== 0) {
            signers = this.state.data1.map((elem , index) => {
                let amount = (elem.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
                let base_asset = elem.base_asset;
                let counter_asset = elem.counter_asset;
                let date = elem.created_at;
                let receive_amount = elem.receive_amount;
                if(base_asset === 'XIR')
                {
                    receive_amount = (parseFloat(receive_amount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                else
                {
                    receive_amount = parseInt(receive_amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                if (order_status === 1)
                {
                    order_status = 'Pending'
                }
                else if (order_status === 2)
                {
                    order_status = 'Done'
                }
                else if (order_status === 0 || order_status === 3)
                {
                    order_status = 'Rejected'
                }
                return <div key={index} className="row smallText border-top border-warning text-secondary">
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{date}</div>
                    <div className="col-sm-3 col-12 text-center pt-2 pb-2">{amount} {base_asset}</div>
                    <div className="col-sm-3 col-12 text-center pt-2 pb-2">{receive_amount} {counter_asset}</div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{status} <a target='_blank' href={"https://horizon.stellar.org/transactions/" + hash} className="text-center text-secondary pt-2 pb-2 ml-2"><FontAwesomeIcon className="" icon={faExternalLinkSquareAlt}/></a></div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{order_status} <a target='_blank' href={"https://horizon.stellar.org/transactions/" + hash_paid} className="text-center text-secondary pt-2 pb-2 ml-2"><FontAwesomeIcon className="" icon={faExternalLinkSquareAlt}/></a></div>
                </div>;
            });
        }
        else if(this.state.length1 === 0)
        {
            signers = <div className="col-12 text-center border-top border-warning text-secondary pt-2 pb-2 pr-0 pl-0 smallText">There is no item to show.</div>;
        }

        if (this.state.data2 && this.state.currentTab === 2 && this.state.length2 !== 0) {
            signers = this.state.data2.map((elem , index) => {
                let date = elem.created_at;
                let amount = elem.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let price = elem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                let track = elem.tracking_code;
                let hash_paid = elem.paid_hash;
                let hash = elem.order.status.value;
                let status = hash;
                if (status === 0)
                {
                    status = 'Rejected';
                }
                else if (status === 1)
                {
                    status = 'Successful';
                }
                // let order_status = elem.order.order_status.value;
                // if (order_status == 1)
                // {
                //     order_status = 'Pending'
                // }
                // else if (order_status == 2)
                // {
                //     order_status = 'Done'
                // }
                // else if (order_status == 0 || order_status == 3)
                // {
                //     order_status = 'Rejected'
                // }
                return <div key={index} className="row smallText border-top border-warning text-secondary">
                    {/*<div className="col-4 text-center text-light pt-2 pb-2">{request()}</div>*/}
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{date}</div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{price} IRR</div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{amount} XIR</div>
                    <div className="col-sm-3 col-12 text-center pt-2 pb-2">{track}</div>
                    <div className="col-sm-3 col-12 text-center pt-2 pb-2">{status} <a target='_blank' href={"https://horizon.stellar.org/transactions/" + hash_paid} className="text-center text-secondary pt-2 pb-2 ml-2"><FontAwesomeIcon className="" icon={faExternalLinkSquareAlt}/></a></div>
                </div>;
            });
        }
        else if(this.state.length2 === 0)
        {
            signers = <div className="col-12 text-center border-top border-warning text-secondary pt-2 pb-2 pr-0 pl-0 smallText">There is no item to show.</div>;
        }

        if (this.state.data3 && this.state.currentTab === 3 && this.state.length3 !== 0) {
            signers = this.state.data3.map((elem , index) => {
                let amount = (elem.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let receive_amount = (elem.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let track = elem.tracking_code;
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
                if (order_status === 1)
                {
                    order_status = 'Pending'
                }
                else if (order_status === 2)
                {
                    order_status = 'Done'
                }
                else if (order_status === 0 || order_status === 3)
                {
                    order_status = 'Rejected'
                }
                return <div key={index} className="row smallText border-top border-warning text-secondary">
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{date}</div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{amount} XIR</div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{receive_amount} IRR</div>
                    <div className="col-sm-3 col-12 text-center pt-2 pb-2">{bank_account}</div>
                    <div className="col-sm-1 col-12 text-center pt-2 pb-2">{status} <a target='_blank' href={"https://horizon.stellar.org/transactions/" + hash} className="text-center text-secondary pt-2 pb-2 ml-2"><FontAwesomeIcon className="" icon={faExternalLinkSquareAlt}/></a></div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{track}</div>
                    {/*<a target='_blank' href={"https://horizon-testnet.stellar.org/transactions/" + hash_paid} className="text-center text-light pt-2 pb-2 ml-2"><FontAwesomeIcon className="" icon={faExternalLinkSquareAlt}/></a>*/}
                </div>;
            });
        }
        else if(this.state.length3 === 0)
        {
            signers = <div className="col-12 text-center border-top border-warning text-secondary pt-2 pb-2 pr-0 pl-0 smallText">There is no item to show.</div>;
        }

        if (this.state.data4 && this.state.currentTab === 4 && this.state.length4 !== 0) {
            signers = this.state.data4.map((elem , index) => {
                let id = elem.id;
                let track = elem.tracking_code;
                let amount = parseInt(elem.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
                let price = (parseInt((elem.payment_code)/100000)*1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
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
                if (order_status === 1)
                {
                    order_status = 'Pending'
                }
                else if (order_status === 2)
                {
                    order_status = 'Done'
                }
                else if (order_status === 0 || order_status === 3)
                {
                    order_status = 'Rejected'
                }
                return <div key={index} className="row smallText border-top border-warning text-secondary">
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{date}</div>
                    <div className="col-sm-1 col-12 text-center pt-2 pb-2">{amount} XIR</div>
                    <div className="col-sm-1 col-12 text-center pt-2 pb-2">{price} IRR</div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{billing_code}</div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{payment_code}</div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{status} <a target='_blank' href={"https://horizon.stellar.org/transactions/" + hash} className="text-center text-secondary pt-2 pb-2 ml-2"><FontAwesomeIcon className="" icon={faExternalLinkSquareAlt}/></a></div>
                    <div className="col-sm-2 col-12 text-center pt-2 pb-2">{track}</div>
                    {/*<a target='_blank' href={"https://horizon-testnet.stellar.org/transactions/" + hash_paid} className="text-center text-light pt-2 pb-2 ml-2"><FontAwesomeIcon className="" icon={faExternalLinkSquareAlt}/></a>*/}
                </div>;
            });
        }
        else if(this.state.length4 === 0)
        {
            signers = <div className="col-12 text-center border-top border-warning text-secondary pt-2 pb-2 pr-0 pl-0 smallText">There is no item to show.</div>;
        }

        if (this.state.data5 && this.state.currentTab === 5 && this.state.length5 !== 0) {
            signers = this.state.data5.map((elem , index) => {
                console.log(elem);
                let date = elem.created_at;
                let amount = parseInt(elem.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let receiver = elem.receiver;
                return <div key={index} className="row smallText border-top border-warning text-secondary">
                    <div className="col-sm-3 col-12 text-center pt-2 pb-2">{date}</div>
                    <div className="col-sm-3 col-12 text-center pt-2 pb-2">{amount} XIR</div>
                    <div className="col-sm-6 col-12 text-center pt-2 pb-2 word-wrap small">{receiver}</div>
                </div>;
            });
        }
        else if(this.state.length5 === 0)
        {
            signers = <div className="col-12 text-center border-top border-warning text-secondary pt-2 pb-2 pr-0 pl-0 smallText">There is no item to show.</div>;
        }

        if (this.state.data6 && this.state.currentTab === 6 && this.state.length6 !== 0) {
            signers = this.state.data6.map((elem , index) => {
                let date = elem.created_at;
                let amount = parseInt(elem.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let receiver = elem.receiver;
                return <div key={index} className="row smallText border-top border-warning text-secondary">
                    <div className="col-sm-3 col-12 text-center pt-2 pb-2">{date}</div>
                    <div className="col-sm-3 col-12 text-center pt-2 pb-2">{amount} XLM</div>
                    <div className="col-sm-6 col-12 text-center pt-2 pb-2 word-wrap small">{receiver}</div>
                </div>;
            });
        }
        else if(this.state.length6 === 0)
        {
            signers = <div className="col-12 text-center border-top border-warning text-secondary pt-2 pb-2 pr-0 pl-0 smallText">There is no item to show.</div>;
        }

        return(
            <div className="col-sm-9 col-12 clearfix mx-auto">
                <div className="row">
                    <h4 className="col-12 text-center mb-3 mt-3">History</h4>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-8 mx-auto text-center border border-warning mb-2 rounded shadow-lg">
                                <div className="row text-secondary">
                                    <a id="exchange" onClick={this.handleExchange} className="col-sm-2 col-12 text-light border-right border-warning pt-2 pb-2 bg-warning small">Exchange</a>
                                    <a id="deposit" onClick={this.handleDeposit} className="col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small">Deposit</a>
                                    <a id="withdraw" onClick={this.handleWithdraw} className="col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small">Withdrawal</a>
                                    <a id="bill" onClick={this.handleBill} className="col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small">Bill payment</a>
                                    <a id="send-xir" onClick={this.handleSendXir} className="col-sm-2 col-12 border-right border-warning pt-2 pb-2 hover-tab small">Send XIR</a>
                                    <a id="send-xlm" onClick={this.handleSendXlm} className="col-sm-2 col-12 pt-2 pb-2 small hover-tab">Send XLM</a>
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
                            <div className="col-12 border border-warning rounded shadow-lg">
                                {attr}
                                {signers}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-3 text-center mb-3">
                        <div className="row text-secondary">
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