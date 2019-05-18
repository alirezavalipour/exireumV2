import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {Container, Row, Col} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
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
        this.state = {
            inValidPublicKey: false,
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
        const urlPublic = this.Auth.getDomain() + '/user/account/add';
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
                    <form className="col-12" onSubmit={this.handleSubmit}>
                        <label className="col-12 mt-3">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 rounded-left bg-warning">User name</span>
                                <input className="col-9 text-center rounded-right p-2 text-light" type="text" name="user_name" value={this.state.user_name} onChange={this.handleChange}/>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Email</span>
                                <input className="col-9 text-center rounded-right p-2 text-light" type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 rounded-left bg-warning">First name</span>
                                <input className="col-9 text-center rounded-right p-2 text-light" type="text" name="first_name" value={this.state.first_name} onChange={this.handleChange}/>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Last name</span>
                                <input className="col-9 text-center rounded-right p-2 text-light" type="text" name="last_name" value={this.state.last_name} onChange={this.handleChange}/>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 rounded-left bg-warning">National code</span>
                                <input className="col-9 text-center rounded-right p-2 text-light" type="text" name="national_number" value={this.state.national_number} onChange={this.handleChange}/>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Address</span>
                                <textarea className="col-9 text-center rounded-right p-2 text-light" type="text" name="address" onChange={this.handleChange} value={this.state.address}></textarea>
                            </div>
                        </label>
                        <label className="col-12 mt-3">
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Public key</span>
                                <input className="col-9 text-center rounded-right p-2 text-light" type="text" name="public_key" value={this.state.public_key} onChange={this.handleChange}/>
                            </div>
                        </label>
                        <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">UPDATE</button>
                    </form>
                </div>
            </div>
        );
    }
}
export default Profile;