import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faAngleLeft , faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {Container, Row, Col} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class Orders extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.clickPrevButton = this.clickPrevButton.bind(this);
        this.clickNextButton = this.clickNextButton.bind(this);
        this.state = {}
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount() {
        const url = this.Auth.getDomain() + '/user/order';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    data: response.data.data,
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
                this.setState({
                    data: response.data.data,
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
                this.setState({
                    data: response.data.data,
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
        let signers = null;
        if (this.state.data) {
            signers = this.state.data.map((elem , index) => {
                let id = elem.id;
                let amount = elem.price;
                let type = elem.type;
                const request = () => {
                    switch (type) {
                        case 0:
                            return <div>Create account</div>;
                        case 1:
                            return <div>Add account</div>;
                        case 2:
                            return <div>Deposit</div>;
                        case 3:
                            return <div>Exchange</div>;
                        case 4:
                            return <div>Bill payment</div>;
                        case 5:
                            return <div>Withdraw</div>;
                        case 6:
                            return <div>Withdraw</div>;
                    }
                };
                let status = elem.status.value;
                if (status == 0)
                {
                    status = 'Rejected';
                }
                else if (status == 1)
                {
                    status = 'Accepted';
                }
                return <div key={index} className="row">
                    <div className="col-3 text-center text-light border-bottom border-warning pt-2 pb-2">{status}</div>
                    <div className="col-3 text-center text-light border-left border-bottom border-warning pt-2 pb-2">{request()}</div>
                    <div className="col-3 text-center text-light border-left border-bottom border-warning pt-2 pb-2">{amount}</div>
                    <div className="col-3 text-center text-light border-left border-bottom border-warning pt-2 pb-2">{id}</div>
                </div>;
            });
        }
        return(
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Orders</h2>
                    <div className="col-12 border-top border-right border-left border-warning rounded shadow-lg">
                        <div className="row">
                            <div className="col-12 text-center text-light border-bottom border-warning">
                                <div className="row">
                                    <div className="col-3 pt-2 pb-2 font-weight-bold">Status</div>
                                    <div className="col-3 border-left border-warning pt-2 pb-2 font-weight-bold">Request type</div>
                                    <div className="col-3 border-left border-warning pt-2 pb-2 font-weight-bold">Amount</div>
                                    <div className="col-3 border-left border-warning pt-2 pb-2 font-weight-bold">Id</div>
                                </div>
                            </div>
                            <div className="col-12">{signers}</div>
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