import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {} from 'bootstrap-4-react';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import AuthService from './AuthService.jsx';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Loader from "./ExchangeXir";
var StellarSdk = require('stellar-sdk');

class PersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            load: false,
        };
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount() {
        const url = this.Auth.getDomain() + '/user/profile';
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
        return axios.all ([
            axios.get(url, config)
                .then(response => {
                    this.setState({
                        user_name: response.data.username,
                        email: response.data.email,
                        first_name: response.data.first_name,
                        last_name: response.data.last_name,
                        national_number: response.data.national_number,
                        address: response.data.address,
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

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        window.scrollTo(0, -100);
        const url = this.Auth.getDomain() + '/user/profile';
        const formData = {
            username: this.state.user_name,
            email: this.state.email,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            national_number: this.state.national_number,
            address: this.state.address,
            mobile: this.state.mobile,
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
                        message: response.data.message,
                    });
                    setTimeout(function() {
                        window.location.replace('/Components/Profile');
                    }.bind(this), 2000)
                });
    }

    render() {
        let messages = "";
        if(this.state.message)
        {
            messages = <div className="col-12">
                <div className="col-12 bg-success pt-2 pb-2 mt-5 text-light text-center rounded">Personal information updated</div>
            </div>;
        }
        let loader = "";
        if(this.state.load === false)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load === true)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        return (
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    {messages}
                    <h4 className="col-12 text-center text-light mb-5 mt-5">Personal Information</h4>
                    <form className="col-12 mb-5" onSubmit={this.handleSubmit}>
                        <label className="col-12">
                            <div className="row">
                                <span className="col-3 text-light text-center pt-2 pb-2 bg-warning rounded-left font-weight-bold">User name</span>
                                <input className="col-9 text-light text-center pt-2 pb-2 rounded-right" name="user_name" value={this.state.user_name} onChange={this.handleChange} type="text"/>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row">
                                <span className="col-3 text-light text-center pt-2 pb-2 bg-warning rounded-left font-weight-bold">Email</span>
                                <input className="col-9 text-light text-center pt-2 pb-2 rounded-right" name="email" value={this.state.email} onChange={this.handleChange} type="text"/>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row">
                                <span className="col-3 text-light text-center pt-2 pb-2 bg-warning rounded-left font-weight-bold">First name</span>
                                <input className="col-9 text-light text-center pt-2 pb-2 rounded-right" name="first_name" value={this.state.first_name} onChange={this.handleChange} type="text"/>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row">
                                <span className="col-3 text-light text-center pt-2 pb-2 bg-warning rounded-left font-weight-bold">Last name</span>
                                <input className="col-9 text-light text-center pt-2 pb-2 rounded-right" name="last_name" value={this.state.last_name} onChange={this.handleChange} type="text"/>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row">
                                <span className="col-3 text-light text-center pt-2 pb-2 bg-warning rounded-left font-weight-bold">National code</span>
                                <input className="col-9 text-light text-center pt-2 pb-2 rounded-right" name="national_number" value={this.state.national_number} onChange={this.handleChange} type="text"/>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row">
                                <span className="col-3 text-light text-center bg-warning rounded-left font-weight-bold">Address</span>
                                <textarea className="col-9 text-light text-center rounded-right" name="address" onChange={this.handleChange} value={this.state.address}> </textarea>
                            </div>
                        </label>
                        {loader}
                    </form>
                </div>
            </div>
        );
    }
}
export default PersonalInfo;