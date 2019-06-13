import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {} from 'bootstrap-4-react';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import AuthService from './AuthService.jsx';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
var StellarSdk = require('stellar-sdk');

const isValidPublicKey = input => {
    try {
        StellarSdk.Keypair.fromPublicKey(input);
        return true;
    } catch (e) {
        // console.error(e);
        return false;
    }
};

class Profile extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.upgradeAccount = this.upgradeAccount.bind(this);
        this.state = {
            inValidPublicKey: false,
        };
    }

    upgradeAccount(e){
        e.preventDefault();
        window.location.replace('/Components/Upgrade');
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
                        mobile: response.data.mobile,
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
        if(!isValidPublicKey(this.state.public_key))
        {
            this.setState({
                inValidPublicKey: true,
                message: ''
            });
            return true;
        }
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
        const urlPublic = this.Auth.getDomain() + '/user/account/change';
        const formDataPublic = {
            public_key: this.state.public_key,
        };
        const headersPublic = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configPublic = { headers: headersPublic };
        return axios.all ([
            axios.post(url, formData, config)
                .then(response =>{
                    this.setState({
                        inValidPublicKey: false,
                        message: response.data.message,
                    })
                }),
            axios.post(urlPublic, formDataPublic, configPublic)
                .then(response =>{
                    this.setState({
                    });
                    console.log(response);
                }),
        ])
    }

    render() {
        let messages = "";
        if(this.state.message)
        {
            messages = <div className="col-12">
                <div className="col-12 bg-success text-light p-2 rounded shadow-lg text-center mb-5">
                    Files uploaded
                </div>
            </div>;
        }
        if(this.state.inValidPublicKey == true)
        {
            messages = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your public key invalid
                </div>
            </div>;
        }
        return (
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    {messages}
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Profile</h2>
                    <form className="col-12 mb-5" onSubmit={this.handleSubmit}>
                        <div className="col-12 border border-warning rounded shadow-lg">
                            <div className="row">
                                <div className="col-12 border-bottom border-warning">
                                    <div className="row">
                                        <div className="col-12 col-sm-2 pb-3 border-right border-warning">
                                            <FontAwesomeIcon className="icon-size text-light" icon={faUserCircle}/>
                                        </div>
                                        <div className="col-12 col-sm-10 pb-3">
                                            <div className="row">
                                                <div className="col-12 text-light text-left mt-3 font-weight-bold">Personal Information</div>
                                                <div className="col-sm-6 col-12 mt-3">
                                                    <label htmlFor="username" className="enable text-left text-light placholder2">User name</label>
                                                    <input className="col-12 text-center rounded text-light pt-2 pb-2 small" type="text" name="user_name" value={this.state.user_name} onChange={this.handleChange}/>
                                                </div>
                                                <div className="col-sm-6 col-12 mt-3">
                                                    <label htmlFor="email" className="enable text-left text-light placholder2">Email</label>
                                                    <input className="col-12 text-center rounded text-light pt-2 pb-2 small" type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
                                                </div>
                                                <div className="col-sm-6 col-12 mt-3">
                                                    <label htmlFor="first_name" className="enable text-left text-light placholder2">First name</label>
                                                    <input className="col-12 text-center rounded text-light pt-2 pb-2 small" type="text" name="first_name" value={this.state.first_name} onChange={this.handleChange}/>
                                                </div>
                                                <div className="col-sm-6 col-12 mt-3">
                                                    <label htmlFor="last_name" className="enable text-left text-light placholder2">Last name</label>
                                                    <input className="col-12 text-center rounded text-light pt-2 pb-2 small" type="text" name="last_name" value={this.state.last_name} onChange={this.handleChange}/>
                                                </div>
                                                <div className="col-sm-6 col-12 mt-3">
                                                    <label htmlFor="national_number" className="enable text-left text-light placholder2">National code</label>
                                                    <input className="col-12 text-center rounded text-light pt-2 pb-2 small" type="text" name="national_number" value={this.state.national_number} onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 pb-3 border-bottom border-warning">
                                    <div className="row">
                                        <div className="col-12 text-light text-left mt-3 font-weight-bold">Address</div>
                                        <div className="col-12 mt-3">
                                            <label htmlFor="address" className="enable text-left text-light placholder2">Address</label>
                                            <textarea className="col-12 text-center rounded text-light small" name="address" onChange={this.handleChange} value={this.state.address}>
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 pb-3 border-bottom border-warning">
                                    <div className="row">
                                        <div className="col-12 text-light text-left mt-3 font-weight-bold">Account</div>
                                        <div className="col-12 mt-3">
                                            <label htmlFor="public_key" className="enable text-left text-light placholder2">Public key</label>
                                            <input className="col-12 text-center rounded text-light pt-2 pb-2 small" type="text" name="public_key" value={this.state.public_key} onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-12 mt-3 mb-3 text-center">
                                    <button className="col-12 col-sm-6 mx-auto text-center rounded text-light bg-success border border-success pt-1 pb-1" onClick={this.upgradeAccount}>Upgrade your account</button>
                                </div>
                                <div className="col-sm-6 col-12 mt-3 mb-3 text-center">
                                    <button className="col-12 col-sm-6 mx-auto bg-warning rounded shadow-lg text-light pt-1 pb-1">UPDATE</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
export default Profile;