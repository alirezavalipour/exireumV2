import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Countdown from 'react-countdown-now';
import Loader from 'react-loader-spinner';
const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
        return true;
    } else {
        return <span>0{minutes}:{seconds}</span>;
    }
};

class sms extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.activeClick = this.activeClick.bind(this);
        this.unResendClick = this.unResendClick.bind(this);
        this.state = {
            load:false,
            time: Date.now() + 120000
        }
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
    }

    componentWillMount() {
        if (this.Auth.loggedIn()) {
            window.location.replace('/Components/Dashboard');
        }
    }

    unResendClick(e){
        e.preventDefault();
        this.Auth.resend()
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                alert(err);
            });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            load: !this.state.load
        });
        this.Auth.sms(this.state.temporary_code)
            .then((res) => {
                this.setState({
                    message2: res.data.message,
                });
                if(!this.state.message2)
                {
                    window.location.replace('/Components/Confirmpassword');
                }
                console.log(res);
            })
            .catch((err) => {
                let mess = err.response;
                this.setState({
                    load: false,
                    message1: mess.data.message
                });
                if(!this.state.message1)
                {
                    window.location.replace('/Components/Confirmpassword');
                }
                console.log(err.response);
            });
    }

    activeClick() {
        document.getElementById("verify").setAttribute("class", "enable col-12 mt-2 text-center text-light");
    }

    render() {
        let mes ='';
        if (this.state.message1 || this.state.message2)
        {
            mes = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    The verification code is invalid
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
        return(
            <div className="col-sm-6 col-12 clearfix mx-auto">
                <div className="row">
                    {mes}
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Verify</h2>
                    <div className="col-12 text-light text-center mb-5">Please enter the verification code sent to your phone by SMS</div>
                    <form  className="col-12" onSubmit={this.handleFormSubmit}>
                        <input className="col-12 p-2 rounded shadow-lg" name="temporary_code" type="tel" onChange={this.handleChange}/>
                        {loader}
                    </form>
                    <div className="text-center text-light col-12 mt-3 fontSize">
                        <Countdown
                        date={this.state.time}
                        onComplete={this.activeClick}
                        renderer={renderer}
                        />
                    </div>
                    <a id="verify" className="disable col-12 mt-3 text-center text-light" onClick={this.unResendClick}>resend code to phone number</a>
                </div>
            </div>)
    }
}
export default sms;
