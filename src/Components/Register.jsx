import React, { Component } from 'react';
import { Router, Route, Link, browserHistory, IndexRoute, HashRouter } from 'react-router-dom';
// import { Redirect } from 'react-router-dom';
import AuthService from './AuthService.jsx';
import TermApp from '../app.jsx';
import AccountView from './Session/AccountView.jsx';


class Register extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
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
        window.localStorage.setItem('mobile' , this.state.mobile);
        this.Auth.register(this.state.type, this.state.username, this.state.email, this.state.company_name, this.state.first_name, this.state.last_name, this.state.national_id, this.state.address, this.state.mobile)
            .then((res) => {
                window.location.replace('/#verify');
            })
            .catch((err) => {
                this.setState({
                    err : err,
                });
            });
        //   if(res.errors)
        //   {
        //     console.log(res.errors);
        //     this.setState({
        //       errors : res.errors,
        //     });
        //   }
        // else{
        //   window.location.replace('/#verify');
        //   }

        // })
        // .catch((err) => {
        //   this.setState({
        //       err : err,
        //   });
        //   console.log(err);
        // });
    }

    render() {
        return (
            <div className="center">
                <div className="center_in"></div>
                <div className="card">
                    <h1>Register</h1>
                    <form  className="personal" onSubmit={this.handleFormSubmit}>
                        <select className="form-item" onChange={this.handleFormChange} name="type">
                            <option value="personal" type="0">Personal</option>
                            <option value="company" type="1">Company</option>
                        </select>
                        <input
                            className="form-item"
                            placeholder="User name : js"
                            name="username"
                            minLength="3"
                            maxLength="10"
                            required="required"
                            type="text"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-item"
                            placeholder="Email : js@gmail.com"
                            name="email"
                            required="required"
                            type="email"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-item"
                            placeholder="First name : John"
                            name="first_name"
                            minLength="3"
                            maxLength="10"
                            required="required"
                            type="text"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-item"
                            placeholder="Last name : Smith"
                            name="last_name"
                            minLength="3"
                            maxLength="10"
                            required="required"
                            type="text"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-item"
                            placeholder="National code : 0123456789"
                            name="national_number"
                            required="required"
                            type="tel"
                            pattern="^[0-9][0-9][0-9][0-9]{7,7}$"
                            onChange={this.handleChange}
                        />
                        <textarea
                            className="form-item"
                            placeholder="Address : No1,2nd Street,Tehran,Iran"
                            name="address"
                            minLength="10"
                            maxLength="100"
                            required="required"
                            type="text"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-item"
                            placeholder="Phone : 09191000000"
                            name="mobile"
                            required="required"
                            type="tel"
                            pattern="^[0][9][0-3][0-9]{8,8}$"
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

export default Register;
