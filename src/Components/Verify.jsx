import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AuthService from './AuthService.jsx';
// import ReactCountdownClock from 'react-countdown-clock';


class sms extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.activeClick = this.activeClick.bind(this);
        this.unResendClick = this.unResendClick.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
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


        this.Auth.sms(this.state.temporary_code)
            .then((res) => {
                window.location.replace('/#setpassword');
            })
            .catch((err) => {
                alert(err);
            });
    }

    activeClick() {
        document.getElementById("verify").setAttribute("class", "enable");
    }

    render() {
        return(
            <div className="center">
                <div className="center_in"></div>
                <div className="verify_sms">
                    <h1>Verify</h1>
                    <div className="verify_sms_text">Please enter the verification code sent to your phone by SMS</div>
                    <form  className="verifysms" onSubmit={this.handleFormSubmit}>
                        <input
                            className="code"
                            placeholder=""
                            name="temporary_code"
                            type="tel"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-submit"
                            value="SUBMIT"
                            type="submit"
                        />
                    </form>
                    {/*<div id="timer" className="timer">*/}
                        {/*<ReactCountdownClock*/}
                            {/*className="timerin"*/}
                            {/*seconds={120}*/}
                            {/*color="#fff"*/}
                            {/*alpha={1}*/}
                            {/*size={85}*/}
                            {/*onComplete={this.activeClick}*/}
                        {/*/>*/}
                    {/*</div>*/}
                    <a id="verify" className="disable" onClick={this.unResendClick}>resend code to phone number</a>
                </div>
            </div>)
    }
}
export default sms;
