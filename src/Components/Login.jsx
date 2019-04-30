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
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
const cookie = new Cookies();

class Login extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.showPlacholder = this.showPlacholder.bind(this);
        this.state = {
            err: "",
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

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            load: !this.state.load
        });
        this.Auth.login(this.state.mobile, this.state.password)
            .then(res => res.json())
            .then(response =>   {
                this.Auth.setToken(response.access_token);
                cookie.set('reactUrl', 'true', { domain :'https://exireum.com' , path:'/' });
                window.location.replace('/Components/Dashboard');
            })
            .catch((err) => {
                this.setState({
                    err : err,
                    load: false
                });
            });
    }

    render() {
        let error ="";
        if(this.state.err != ""){
            error = <div className="col-12"><div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">This phone number or password is incorrect</div></div>;
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
            <div className="col-sm-6 col-12 clearfix mx-auto">
                <div className="row">
                    {error}
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Login</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="mobile">Phone number</label>
                                {/*<input className="input-placeholder col-12 p-2 mt-3 rounded shadow-lg text-light" placeholder="Phone number" name="mobile" required="required" type="tel" pattern="^[0][9][0-3][0-9]{8,8}$" onChange={this.handleChange}/>*/}
                                <IntlTelInput
                                    containerClassName="input-placeholder intl-tel-input col-12 pr-0 pl-0 mt-3"
                                    inputClassName="col-12 pt-2 pb-2 rounded shadow-lg"
                                    preferredCountries={['ir' , 'ca' , 'de']}
                                    onPhoneNumberChange={ (e , f , g , h , i) => {
                                        this.setState({
                                            mobile: '+' + h.replace(/\D/g, '')
                                        });
                                    }}
                                    // onPhoneNumberBlur={}
                                    fieldName='mobile'
                                    placeholder='Phone number : 09191000000'
                                    autoComplete='off'
                                    separateDialCode='true'
                                />
                            </div>
                        </div>
                        <div className="col-12" onClick={this.showPlacholder} onChange={this.showPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="password">Password</label>
                                <input className="input-placeholder col-12 mt-3 p-2 rounded shadow-lg" placeholder="Password" name="password" minLength="8" required="required" type="password" onChange={this.handleChange}/>
                            </div>
                        </div>
                        {loader}
                    </form>
                    <a href='../Components/ResetPassword' className="col-12 text-light text-center pt-2 pb-2 mt-2 font-weight-bold">Forget your password!</a>
                </div>
            </div>
        );
    }
}

export default Login;
