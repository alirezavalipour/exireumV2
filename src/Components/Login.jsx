import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class Login extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            err: ""
        }
    }

    componentWillMount() {
        if (this.Auth.loggedIn()) {
            window.location.replace('/#dashboard/account');
        }
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.Auth.login(this.state.mobile, this.state.password)
            .then((res) => {
                window.location.replace('/#dashboard/account');
            })
            .catch((err) => {
                this.setState({
                    err : err,
                });
            });
    }

    render() {
        let saman ="";
        if(this.state.err!=""){
            saman = <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center">This phone number or password is incorrect</div>;
        }
        return (
            <div className="col-sm-6 col-12 clearfix mx-auto">
                <div className="row">
                    {saman}
                    <h2 className="col-12 text-light">Login</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="phone number" name="mobile" required="required" type="text" pattern="^[0][9][0-3][0-9]{8,8}$" onChange={this.handleChange}/>
                        <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Password" name="password" minLength="8" required="required" type="password" onChange={this.handleChange}/>
                        <input className="col-12 bg-success p-2 rounded mt-2 shadow-lg" value="SUBMIT" type="submit"/>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
