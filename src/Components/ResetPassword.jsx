import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Countdown from 'react-countdown-now';
import Loader from 'react-loader-spinner';
import Cookies from "universal-cookie";
import ReactPasswordStrength from 'react-password-strength';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
const cookie = new Cookies();
const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
        return true;
    } else {
        return <span>0{minutes}:{seconds}</span>;
    }
};

class ResetPassword extends Component {
    constructor() {
        super();
        this.showPlacholder = this.showPlacholder.bind(this);
        this.hidPlacholder = this.hidPlacholder.bind(this);
        this.showPlacholder2 = this.showPlacholder2.bind(this);
        this.hidPlacholder2 = this.hidPlacholder2.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleFormSubmit2 = this.handleFormSubmit2.bind(this);
        this.handleFormSubmit3 = this.handleFormSubmit3.bind(this);
        this.Auth = new AuthService();
        this.state = {
            load1: false,
            load2: false,
            load3: false,
            time: Date.now() + 120000
        }
    }

    showPlacholder(e)
    {
        e.preventDefault();
        e.currentTarget.children[0].children[0].setAttribute("class", "enable text-left text-light placholder pr-2 pl-2");
        e.currentTarget.children[0].children[1].lastChild.setAttribute('placeholder','');
    }

    hidPlacholder(e)
    {
        e.preventDefault();
        if(!e.currentTarget.children[0].children[1].value)
        {
            e.currentTarget.children[0].children[0].setAttribute("class" , "disable");
            e.currentTarget.children[0].children[1].lastChild.setAttribute('placeholder',e.currentTarget.children[0].children[0].dataset.input);
        }
    }

    showPlacholder2(e) {
        e.preventDefault();
        e.currentTarget.children[0].children[0].setAttribute("class", "enable text-left text-light placholder pr-2 pl-2");
        e.currentTarget.children[0].children[1].children[0].setAttribute("placeholder"," ");
    }

    hidPlacholder2(e)
    {
        e.preventDefault();
        if(!e.currentTarget.children[0].children[1].value)
        {
            e.currentTarget.children[0].children[0].setAttribute("class" , "disable");
            e.currentTarget.children[0].children[1].children[0].setAttribute('placeholder',e.currentTarget.children[0].children[0].innerHTML);
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
        this.setState({
            load1: !this.state.load1
        });
        const url = this.Auth.getDomain() + '/auth/resend';
        const formData = {
            mobile: this.state.mobile,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then((res) => {
                this.setState({
                    message: res.data.message
                });
            })
            .catch((err) => {
                this.setState({
                    load1: false
                });
            });
    }

    handleFormSubmit2(e) {
        e.preventDefault();
        this.setState({
            load2: !this.state.load2
        });
        const url = this.Auth.getDomain() + '/auth/verify';
        const formData = {
            mobile: this.state.mobile,
            temporary_code: this.state.temporary_code
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(res =>{
                this.Auth.setToken(res.data.token);
                this.setState({
                    token: res.data.token,
                    message2: res.data.message,
                });
                if(!this.state.message2)
                {
                    // window.location.replace('/Components/Confirmpassword');
                }
            })
            .catch((err) => {
                let mess = err.response;
                this.setState({
                    load2: false,
                    message1: mess.data.message
                });
                if(!this.state.message1)
                {
                    // window.location.replace('/Components/Confirmpassword');
                }
            });
    }

    handleFormSubmit3(e) {
        e.preventDefault();
        this.setState({
            load3: !this.state.load3,
        });
        const url = `${this.Auth.domain}/auth/password`;
        const formData = {
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then((res) => {
                cookie.set('reactUrl', 'true', { domain : '.exireum.com' , path :'/' });
                window.location.replace('/Components/Dashboard');
            })
            .catch((err) => {
                this.setState({
                    err: err.response.data.message,
                    load3: false
                });
            });
    }

    activeClick() {
        document.getElementById("verify").setAttribute("class", "enable col-12 mt-2 text-center text-light");
    }

    render() {
        let equalpass = "";
        if (this.state.err) {
            equalpass = <div className="col-12">
                <div className="col-12 bg-danger text-center text-light p-2 mb-5 rounded shadow-lg"> Your password and
                    confirm password are not match
                </div>
            </div>;
        }
        let mes ='';
        if (this.state.message1 || this.state.message2)
        {
            mes = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    The verification code is invalid
                </div>
            </div>;
        }
        let loader1 = "";
        if(this.state.load1 === false)
        {
            loader1 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load1 === true)
        {
            loader1 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        let loader2 = "";
        if(this.state.load2 === false)
        {
            loader2 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load2 === true)
        {
            loader2 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        let loader3 = "";
        if(this.state.load3 === false)
        {
            loader3 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load3 === true)
        {
            loader3 = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        if(!this.state.message && !this.state.token) {
            return (
                <div className="col-sm-6 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Reset password</h2>
                        <form className="col-12" onSubmit={this.handleFormSubmit}>
                            <div className="col-12" onFocus={this.showPlacholder} onBlur={this.hidPlacholder}>
                                <div className="row">
                                    <label data-input="Phone number : 09191000000" className="disable" htmlFor="mobile">Phone number</label>
                                    {/*<input className="input-placeholder col-12 p-2 mt-3 rounded shadow-lg text-light"*/}
                                           {/*placeholder="Phone number : 09191000000" name="mobile" required="required"*/}
                                           {/*type="tel" pattern="^[0][9][0-3][0-9]{8,8}$" onChange={this.handleChange}/>*/}
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
                            {loader1}
                        </form>
                    </div>
                </div>
            );
        }
        else if(this.state.message && !this.state.token)
        {
            return(
                <div className="col-sm-6 col-12 clearfix mx-auto">
                    <div className="row">
                        {mes}
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Reset password</h2>
                        <div className="col-12 text-light text-center mb-5">Please enter the verification code sent to your phone by SMS</div>
                        <form  className="col-12" onSubmit={this.handleFormSubmit2}>
                            <input className="col-12 p-2 rounded shadow-lg" name="temporary_code" type="tel" onChange={this.handleChange}/>
                            {loader2}
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
                </div>
            );
        }
        else if(this.state.message && this.state.token)
        {
            return(
                <div className="col-sm-6 col-12 clearfix mx-auto">
                    <div className="row">
                        {equalpass}
                        <h4 className="col-12 text-light mb-5 text-center mt-5">Reset password</h4>
                        <form autoComplete='nope' className="col-12" onSubmit={this.handleFormSubmit3}>
                            <div className="col-12" onFocus={this.showPlacholder2} onBlur={this.hidPlacholder2}>
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
                                        value=""
                                        scoreWords={[]}
                                        changeCallback={(e) => {
                                            this.setState({
                                                password: e.password
                                            });
                                        }}
                                        inputProps={{
                                            className: "col-12",
                                            autoComplete: "new-password",
                                            name: "password",
                                            placeholder: 'password',
                                            required: "required",
                                            value: "1234" ,
                                            type: "password",
                                            onChange: 'this.handleChange'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-12" onFocus={this.showPlacholder2} onBlur={this.hidPlacholder2}>
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
                                            this.setState({
                                                password_confirmation: e.password
                                            });
                                        }}
                                        inputProps={{
                                            className: "col-12",
                                            autoComplete: "nope",
                                            name: "password_confirmation",
                                            placeholder: 'Confirm password',
                                            required: "required",
                                            type: "password"
                                        }}
                                    />
                                </div>
                            </div>
                            {loader3}
                        </form>
                    </div>
                </div>
            );
        }
    }
}
export default ResetPassword;