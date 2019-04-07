import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class DepositXirWithIpg extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            price: null,
            secret_key:'',
            xdr: null,
            public_key:''
        }
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
        let amount =  e.target.value;
        var url= `${this.Auth.domain}/user/convert?type=deposit&amount=` + amount;
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

    componentWillMount() {
        const url = this.Auth.getDomain() + '/user/account';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    public_key: response.data[0].public_key
                })
            })
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const url = `${this.Auth.domain}/user/deposit`;
        const formData = {
            amount: this.state.amount,
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
                if(response.status == 200){
                    window.location.replace(this.Auth.getDomain()+"/user/order/pay/" + response.data.order_id );
                }
            });
    }

    render() {
        // let account = this.props.d.session.account;
        // let allBalances = account.getSortedBalances();
        // let  temp = allBalances.map(elem =>{
        //
        //     if(elem.code=="EXIR")
        //     {
        //         return (<div className="accept_xir2">
        //             <div>XIR accepted</div>
        //         </div>);
        //     }
        // })
        //
        // console.log(temp.length);
        // if (temp.length > 1) {
        //     data  = temp ;
        // }
        return(
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <h2 className="col-12 text-light">Deposit XIR With IPG</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <label className="col-12">
                            <div className="row shadow-lg">
                                <span className="col-3 bg-info p-2 mt-2 rounded-left text-center text-light">Amount XIR (Exir)</span>
                                <input className="col-9 p-2 mt-2 rounded-right text-center" placeholder="" name="amount" minLength="5" type="tel" onChange={this.handleChange}/>
                            </div>
                        </label>
                        <label className="col-12">
                            <div className="row shadow-lg">
                                <span className="col-3 bg-info p-2 mt-2 rounded-left text-center text-light">Amount will be IRR (Rial)</span>
                                <div className="col-9 p-2 mt-2 rounded-right bg-white text-center">  {this.state.rial}  </div>
                            </div>
                        </label>
                        <button className="col-3 bg-success p-2 mt-2 rounded shadow-lg">Pay</button>
                    </form>
                </div>
            </div>
        );
    }
}
export default DepositXirWithIpg;