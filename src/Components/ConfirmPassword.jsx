import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Container, Row, Col} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import ReactPasswordStrength from 'react-password-strength';


class ConfirmPassword extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.showPlacholder = this.showPlacholder.bind(this);
        this.state = {
            err: ""
        }
    }

    showPlacholder(e) {
        e.preventDefault();
        e.currentTarget.children[0].children[0].setAttribute("class", "enable text-left text-light placholder pr-2 pl-2");
        e.currentTarget.children[0].children[1].children[0].removeAttribute("placeholder");
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        console.log(e);
        this.Auth.setpassword(this.state.password, this.state.password_confirmation)
            .then((res) => {
                window.location.replace('/Components/Account');
            })
            .catch((err) => {
                this.setState({
                    err: err,
                });
            });
    }

    render() {
        let equalpass = "";
        if (this.state.err != "") {
            equalpass = <div className="col-12">
                <div className="col-12 bg-danger text-center text-light p-2 mb-5 rounded shadow-lg"> Your password and
                    confirm password are not match
                </div>
            </div>;
        }
        return (
            <div className="col-sm-6 col-12 clearfix mx-auto">
                <div className="row">
                    {equalpass}
                    <h2 className="col-12 text-light mb-5 text-center font-weight-bold">Set your password</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="password">New Password</label>
                                {/*<input className="input-placeholder col-12 p-2 mt-3 rounded shadow-lg" placeholder="New Password" name="password" minLength="8" required="required" type="password" onChange={this.handleChange}/>*/}
                                <ReactPasswordStrength
                                    className="input-placeholder col-12 p-0 mt-3 rounded shadow-lg"
                                    style={{
                                        backgroundColor: '#151d2e',
                                        border: '2px solid #ffc107',
                                        color: '#fff'
                                    }}
                                    minLength={4}
                                    minScore={0}
                                    scoreWords={[]}
                                    changeCallback={(e) => {
                                        this.setState({
                                                password: e.password
                                            });
                                    }}
                                    inputProps={{
                                        className: "col-12",
                                        autoComplete: "off",
                                        name: "password",
                                        placeholder: 'password',
                                        required: "required",
                                        type: "password",
                                        onChange: 'this.handleChange'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="password_confirmation">Confirm Password</label>
                                {/*<input className="input-placeholder col-12 p-2 mt-3 rounded shadow-lg" placeholder="Confirm Password" name="password_confirmation" minLength="8" required="required" type="password" onChange={this.handleChange}/>*/}
                                <ReactPasswordStrength
                                    className="input-placeholder col-12 p-0 mt-3 rounded shadow-lg"
                                    style={{
                                        backgroundColor: '#151d2e',
                                        border: '2px solid #ffc107',
                                        color: '#fff'
                                    }}
                                    minLength={4}

                                    minScore={0}
                                    scoreWords={[]}
                                    changeCallback={(e) => {
                                        console.log(e)
                                        this.setState({
                                                password_confirmation: e.password
                                            });
                                    }}
                                    inputProps={{
                                        className: "col-12",
                                        autoComplete: "off",
                                        name: "password_confirmation",
                                        placeholder: 'Confirm password',
                                        required: "required",
                                        type: "password"

                                    }}
                                />
                            </div>
                        </div>
                        <input className="col-12 mt-3 p-2 bg-warning rounded shadow-lg" value="SUBMIT" type="submit"/>
                    </form>
                </div>
            </div>
        );
    }
}

export default ConfirmPassword;
