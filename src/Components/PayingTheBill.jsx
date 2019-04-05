import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class PayingTheBill extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.state = {
        }
    }
    render() {
        return (
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <h2 className="col-12 text-light">Paying the bill</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <label className="col-12">
                            <div className="row shadow-lg">
                                <span className="col-3 bg-info p-2 mt-2 rounded-left text-center text-light">Billing code</span>
                                <input className="col-9 p-2 mt-2 rounded-right text-center" placeholder="" name="billing_code" type="tel" onChange={this.handleChange}/>
                            </div>
                        </label>
                        <label className="col-12">
                            <div className="row shadow-lg">
                                <span className="col-3 bg-info p-2 mt-2 rounded-left text-center text-light">Payment code</span>
                                <input className="col-9 p-2 mt-2 rounded-right text-center" placeholder="" name="payment_code" type="tel" onChange={this.handleChange}/>
                            </div>
                        </label>
                        <button className="col-3 bg-success p-2 mt-2 rounded shadow-lg">Pay</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default PayingTheBill;
