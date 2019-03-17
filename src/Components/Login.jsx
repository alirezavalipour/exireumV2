import React, { Component } from 'react';
import { Router, Route, Link, browserHistory, IndexRoute, HashRouter } from 'react-router-dom';
// import { Redirect } from 'react-router-dom';
import AuthService from './AuthService.jsx';

import TermApp from '../app.jsx';
import AccountView from './Session/AccountView.jsx';


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
        if(this.state.err!=""){
            return (
                <div className="center">
                    <div className="center_in"></div>
                    <div className="card">
                        <div className="registererror">This phone number or password is incorrect</div>
                        <h1>Login</h1>
                        <form onSubmit={this.handleFormSubmit}>
                            <input
                                className="form-item"
                                placeholder="phone number"
                                name="mobile"
                                required="required"
                                type="text"
                                pattern="^[0][9][0-3][0-9]{8,8}$"
                                onChange={this.handleChange}
                            />
                            <input
                                className="form-item"
                                placeholder="Password"
                                name="password"
                                minLength="8"
                                required="required"
                                type="password"
                                onChange={this.handleChange}
                            />
                            <input
                                className="form-submit"
                                value="SUBMIT"
                                type="submit"
                            />
                        </form>
                    </div>
                </div>
            );
        }
        else{
            return (
                <div className="center">
                    <div className="center_in"></div>
                    <div className="card">
                        <h1>Login</h1>
                        <form onSubmit={this.handleFormSubmit}>
                            <input
                                className="form-item"
                                placeholder="phone number"
                                name="mobile"
                                required="required"
                                type="text"
                                pattern="^[0][9][0-3][0-9]{8,8}$"
                                onChange={this.handleChange}
                            />
                            <input
                                className="form-item"
                                placeholder="Password"
                                name="password"
                                minLength="8"
                                required="required"
                                type="password"
                                onChange={this.handleChange}
                            />
                            <input
                                className="form-submit"
                                value="SUBMIT"
                                type="submit"
                            />
                        </form>
                    </div>
                </div>
            );
        }
    }


}

export default Login;
