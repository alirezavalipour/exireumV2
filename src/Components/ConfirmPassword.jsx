import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AuthService from './AuthService.jsx';


class ConfirmPassword extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            err: ""
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


        this.Auth.setpassword(this.state.password, this.state.password_confirmation)
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
            return(
                <div className="center">
                    <div className="center_in"></div>
                    <div className="set_password">
                        <div className="registererror">Your password and confirm password are not match</div>
                        <h1>Set your password</h1>
                        <form  className="personal" onSubmit={this.handleFormSubmit}>
                            <input
                                className="form-item"
                                placeholder="New Password"
                                name="password"
                                minLength="8"
                                required="required"
                                type="password"
                                onChange={this.handleChange}
                            />
                            <input
                                className="form-item"
                                placeholder="Confirm Password"
                                name="password_confirmation"
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
            return(
                <div className="center">
                    <div className="center_in"></div>
                    <div className="set_password">
                        <h1>Set your password</h1>
                        <form  className="personal" onSubmit={this.handleFormSubmit}>
                            <input
                                className="form-item"
                                placeholder="New Password"
                                name="password"
                                minLength="8"
                                required="required"
                                type="password"
                                onChange={this.handleChange}
                            />
                            <input
                                className="form-item"
                                placeholder="Confirm Password"
                                name="password_confirmation"
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
export default ConfirmPassword;
