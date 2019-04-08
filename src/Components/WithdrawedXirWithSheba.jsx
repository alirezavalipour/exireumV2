import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
var StellarSdk = require('stellar-sdk');
class WithdrawedXirWithSheba extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleForSignWithSecretKey = this.handleForSignWithSecretKey.bind(this);
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
            var url= `${this.Auth.domain}/user/convert?type=withdraw&amount=` + amount;
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
    }

    componentWillMount() {
        const url = this.Auth.getDomain() + '/user/bank-account';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        const urlPublic = this.Auth.getDomain() + '/user/account';
        const headersPublic = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configPublic = { headers: headersPublic };
        return axios.all([
            axios.get(url, config)
                .then(response => {
                    this.setState({
                        sheba: response.data[1].sheba
                    });
                }),
            axios.get(urlPublic, configPublic)
                .then(response => {
                    this.setState({
                        public_key: response.data[0].public_key
                    });
                })
        ]);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const url = `${this.Auth.domain}/user/stellar/withdraw`;
        const formData = {
            amount: this.state.amount,
            public_key: this.state.public_key,
            sheba: this.state.sheba,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response =>{
                this.setState({
                    xdr: response.data.xdr
                });
            });
    }

    handleForSignWithSecretKey(e){
        e.preventDefault();
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        let keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key);
        //console.log(keypair);
        // let xdr = StellarSdk.xdr.TransactionEnvelope.fromXDR(this.state.xdr,'base64');
        let transaction = new StellarSdk.Transaction(this.state.xdr);
        transaction.sign(keypair);
        let xdr = transaction.toEnvelope().toXDR('base64');
        const url = `${this.Auth.domain}/user/stellar/withdraw/submit`;
        const formData = {
            xdr: xdr,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response =>{
                this.setState({
                    hash: response.data.extras.envelope_xdr
                })
                if(response.status == 200){
                }
                console.log(response);
            });
    }


    render() {

        if(!this.state.xdr && !this.state.hash)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light">Withdrawed XIR with sheba</h2>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 mt-2 rounded-left bg-info">Amount XIR (Exir)</span>
                                    <input className="col-9 text-center rounded-right p-2 mt-2" placeholder="" name="amount" minLength="5" type="tel" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 mt-2 rounded-left bg-info">Sheba</span>
                                    <input className="col-9 text-center rounded-right p-2 mt-2" placeholder={this.state.sheba} name="sheba" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 mt-2 rounded-left bg-info">Amount will be IRR (Rial)</span>
                                    <div className="col-9 text-center rounded-right p-2 mt-2 bg-white">  {this.state.rial}  </div>
                                </div>
                            </label>
                            <button className="col-md-3 col-sm-6 col-12 bg-success p-2 mt-2 rounded shadow-lg">Submit</button>
                        </form>
                    </div>
                </div>
            );
        }
        else if(this.state.xdr && !this.state.hash)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light">Withdrawed XIR with sheba</h2>
                        <form className="col-12" onSubmit={this.handleForSignWithSecretKey}>
                            <label className="col-12">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 mt-2 rounded-left bg-info">Secret key</span>
                                    <input className="col-9 text-center rounded-right p-2 mt-2" placeholder="SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <button className="col-md-3 col-sm-6 col-12 bg-success p-2 mt-2 rounded shadow-lg">Submit</button>
                        </form>
                    </div>
                </div>
            );
        }
        else if(this.state.hash)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light">Withdrawed XIR with sheba</h2>
                        <div className="col-12 text-left text-light mt-2 p-2">Your order has been registred and will be processed whitin few minutes.</div>
                    </div>
                </div>
            );
        }
    }
}
export default WithdrawedXirWithSheba;