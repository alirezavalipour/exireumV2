import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class WithdrawedXir extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            price: null,
            public_key:null,
            secret_key:'',
            data: '',
            sam: '',
        }
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });


        if(e.target.name == "amount"){
            let amount =  e.target.value;
            this.Auth.convertIrrToXir(amount)
                .then((res) => {
                    this.setState({
                        rial : res.result
                    });
                }).catch( (err) => {
                alert(err);
            });
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.Auth.Withdrawed(this.state.amount, this.state.sheba)
            .then((res) => {
            }).catch((err) => {
            alert(err);
        });
    }


    render() {

        if(!this.state.hash)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light">Withdrawed</h2>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 mt-2 rounded-left bg-info">Amount XIR(Exir)</span>
                                    <input className="col-9 text-center rounded-right p-2 mt-2" placeholder="" name="amount" minLength="5" type="tel" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 mt-2 rounded-left bg-info">Sheba</span>
                                    <input className="col-9 text-center rounded-right p-2 mt-2" placeholder="" name="sheba" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 mt-2 rounded-left bg-info">Amount will be IRR(Rial)</span>
                                    <div className="col-9 text-center rounded-right p-2 mt-2 bg-white">  {this.state.rial}  </div>
                                </div>
                            </label>
                            <button className="col-md-3 col-sm-6 col-12 bg-success p-2 mt-2 rounded shadow-lg">submit</button>
                        </form>
                    </div>
                </div>
            );
        }
        else if(this.state.hash)
        {
            return(<div>
                <div className="addaccount_box1">
                    <div className="so-back islandBack">
                        <div className="island">
                            <div className="island__header">Account added</div>
                            <div className="island__paddedContent">
                                <label>
                                    <div className="account-added">Your account has been successfully added.</div>
                                    <a href="/#dashboard/account" className="s-button account_button_fee_xlm">Back to Accounts</a>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
        }
    }
}
export default WithdrawedXir;