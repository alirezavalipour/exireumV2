import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Cookies from "universal-cookie";
import Loader from 'react-loader-spinner';
const cookie = new Cookies();

class Register extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.showPlacholder = this.showPlacholder.bind(this);
        this.state = {
            err: "",
            change: "",
            load: false
        }
    }

    showPlacholder(e)
    {
        e.preventDefault();
        e.currentTarget.children[0].children[0].setAttribute("class", "enable text-left text-light placholder pr-2 pl-2");
        e.currentTarget.children[0].children[1].removeAttribute("placeholder");
    }

    componentWillMount() {
        if (this.Auth.loggedIn()) {
            window.location.replace('/Components/Dashboard');
        }
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
    }

    // componentDidUpdate () {
    //     const element = ReactDOM.findDOMNode(this);
    //     if (element != null) {
    //         window.scrollTo(0, this.scrollPosition)
    //     }
    // }

    checkNationalNumber(x) {
        let a = [];
        let b = [];
        let c = 0;
        let d = 0;
        for (let i = 0; i < x.length; i++) {
            a[i] = parseInt((x / Math.pow(10, i)) % 10);
        }
        b[1] = a[1] * 2;
        b[2] = a[2] * 3;
        b[3] = a[3] * 4;
        b[4] = a[4] * 5;
        b[5] = a[5] * 6;
        b[6] = a[6] * 7;
        b[7] = a[7] * 8;
        b[8] = a[8] * 9;
        b[9] = a[9] * 10;
        c = b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + b[7] + b[8] + b[9];
        d = 11 - (c % 11);
        this.setState({
            nationalNumberValid: d,
            valid: a[0]
        });
        if (d == a[0]) {
            return true;
        }
        return false;
    }


    handleFormSubmit(e) {
        e.preventDefault();
        if (this.checkNationalNumber(this.state.national_number)) {
            this.setState({
                load: !this.state.load
            });
            window.localStorage.setItem('mobile', this.state.mobile);
            this.Auth.register(this.state.username, this.state.email, this.state.first_name, this.state.last_name, this.state.national_number, this.state.address, this.state.mobile)
                .then((res) => {
                    cookie.set('reactUrl', 'true', { domain :'localhost' , path:'/' });
                    window.location.replace('/Components/Verify');
                })
                .catch((err) => {
                    this.setState({
                        err: err,
                        load: false
                    });
                });
            // window.scrollTo(0, -100);
        }
    }

    render() {
        let error = '';
        if (!(this.state.nationalNumberValidValid == this.state.valid)) {
            error = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 rounded shadow-lg text-center mb-5">
                    This national code is incorrect
                </div>
            </div>;
        }
        let errors="";
        if(this.state.err != "")
        {
            error="";
            errors = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 rounded shadow-lg text-center mb-5">
                    The phone number or email already exists
                </div>
            </div>;
        }

        let loader = "";
        if(this.state.load == false)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load == true)
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
            <div id="test" className="col-sm-6 col-12 clearfix mx-auto">
                <div className="row">
                    {errors}
                    {error}
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Sign Up</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <div className="col-12" onChange={this.showPlacholder} onClick={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="username">User name</label>
                                <input className="input-placeholder col-12 p-2 rounded shadow-lg mt-3" placeholder="User name : js" name="username" minLength="3" required="required" type="text" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="col-12" onChange={this.showPlacholder} onClick={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="Email">Email</label>
                                <input className="input-placeholder col-12 mt-3 p-2 rounded shadow-lg" placeholder="Email : js@gmail.com" name="email" required="required" type="email" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="col-12" onChange={this.showPlacholder} onClick={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="first_name">First name</label>
                                <input className="input-placeholder col-12 mt-3 p-2 rounded shadow-lg" placeholder="First name : John" name="first_name" minLength="3" required="required" type="text" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="col-12" onChange={this.showPlacholder} onClick={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="last_name">Last name</label>
                                <input className="input-placeholder col-12 mt-3 p-2 rounded shadow-lg" placeholder="Last name : Smith" name="last_name" minLength="3" required="required" type="text" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="col-12 position-relative" onChange={this.showPlacholder} onClick={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="national_number">National code</label>
                                <input className="input-placeholder col-12 mt-3 p-2 rounded shadow-lg" placeholder="National code : 0123456789" name="national_number" required="required" type="tel" pattern="^[0-9][0-9][0-9][0-9]{7,7}$" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="col-12" onChange={this.showPlacholder} onClick={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="address">Address</label>
                                <textarea className="input-placeholder col-12 mt-3 p-2 rounded shadow-lg" placeholder="Address : No1,2nd Street,Tehran,Iran" name="address" minLength="10" maxLength="100" required="required" type="text" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="col-12" onChange={this.showPlacholder} onClick={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="mobile">Mobile number</label>
                                <input className="input-placeholder col-12 mt-3 p-2 rounded shadow-lg" placeholder="Mobile number : 09191000000" name="mobile" required="required" type="tel" pattern="^[0][9][0-3][0-9]{8,8}$" onChange={this.handleChange}/>
                            </div>
                        </div>
                        {loader}
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;
