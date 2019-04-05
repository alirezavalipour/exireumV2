import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class Register extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            err: "",
            change: "",
        }
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
        this.Auth.register(this.state.username, this.state.email, this.state.first_name, this.state.last_name, this.state.national_number, this.state.address, this.state.mobile)
            .then((res) => {
                window.location.replace('/Components/Verify');
            })
            .catch((err) => {
                this.setState({
                    err : err,
                });
            });
    }

    render() {

        let error="";
        if(this.state.err != "")
        {
            error = <div className="col-12"><div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center">This phone number and email is incorrect</div></div>;
        }
        return (
            <div className="col-sm-6 col-12 clearfix mx-auto">
                <div className="row">
                    {error}
                    <h2 className="col-12 text-light">Register</h2>
                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                        <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="User name : js" name="username" minLength="3" required="required" type="text" onChange={this.handleChange}/>
                        <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Email : js@gmail.com" name="email" required="required" type="email" onChange={this.handleChange}/>
                        <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="First name : John" name="first_name" minLength="3" required="required" type="text" onChange={this.handleChange}/>
                        <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Last name : Smith" name="last_name" minLength="3" required="required" type="text" onChange={this.handleChange}/>
                        <input className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="National code : 0123456789" name="national_number" required="required" type="tel" pattern="^[0-9][0-9][0-9][0-9]{7,7}$" onChange={this.handleChange}/>
                        <textarea className="col-12 mt-2 p-2 rounded shadow-lg" placeholder="Address : No1,2nd Street,Tehran,Iran" name="address" minLength="10" maxLength="100" required="required" type="text" onChange={this.handleChange}/>
                        <input className="col-12 p-2 rounded shadow-lg" placeholder="Phone : 09191000000" name="mobile" required="required" type="tel" pattern="^[0][9][0-3][0-9]{8,8}$" onChange={this.handleChange}/>
                        <input className="col-12 bg-success p-2 rounded shadow-lg mt-2" value="SUBMIT" type="submit"/>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;
