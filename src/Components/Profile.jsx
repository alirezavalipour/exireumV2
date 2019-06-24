import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {} from 'bootstrap-4-react';
import { faUserCircle, } from '@fortawesome/free-solid-svg-icons';
import AuthService from './AuthService.jsx';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
var StellarSdk = require('stellar-sdk');

class Profile extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
        };
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount() {
        const url = this.Auth.getDomain() + '/user/profile';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        const urlPublic = this.Auth.getDomain() + '/user/account';
        const headersPublic = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configPublic = { headers: headersPublic };
        return axios.all ([
            axios.get(url, config)
                .then(response => {
                    this.setState({
                        user_name: response.data.username,
                        email: response.data.email,
                        first_name: response.data.first_name,
                        last_name: response.data.last_name,
                        national_number: response.data.national_number,
                        address: response.data.address,
                    });
                }),
            axios.get(urlPublic, configPublic)
                .then(response => {
                    this.setState({
                        public_key: response.data[0].public_key
                    });
                })
        ]);
    }

    render() {
        return (
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <h4 className="col-12 text-center mb-3 mt-3">Profile</h4>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 border border-warning rounded shadow-lg">
                                <div className="row">
                                    <div className="col-12 pt-2 pb-2 border-bottom border-warning">
                                        <div className="row">
                                            <FontAwesomeIcon className="col-sm-1 icon-size" icon={faUserCircle}/>
                                            <div className="col-sm-11 text-left pl-0 small font-weight-bold">Personal Information</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-12 mt-3">
                                        <div className="row">
                                            <span className="col-4 small text-left font-weight-bold">User name : </span>
                                            <div className="col-8 small text-left">{this.state.user_name}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-12 mt-3">
                                        <div className="row">
                                            <span className="col-4 small text-left font-weight-bold">Email : </span>
                                            <div className="col-8 small text-left">{this.state.email}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-12 mt-3">
                                        <div className="row">
                                            <span className="col-4 small text-left font-weight-bold">Full name : </span>
                                            <div className="col-8 small text-left">{this.state.first_name} {this.state.last_name}</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-12 mt-3">
                                        <div className="row">
                                            <span className="col-4 small text-left font-weight-bold">National id : </span>
                                            <div className="col-8 small text-left">{this.state.national_number}</div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 mt-3">
                                        <div className="row">
                                            <span className="col-4 small text-left font-weight-bold">Address : </span>
                                            <div className="col-8 small text-left">{this.state.address}</div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 mt-3 mb-3 small">
                                        <div className="row">
                                            <div className="col-sm-6 d-none d-sm-block"></div>
                                            <a href={'/Components/PersonalInfo'} className="col-12 col-sm-6 text-hover2"><div className="col-12 bg-warning rounded text-light text-center pt-2 pb-2 font-weight-bold">Edit</div></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 pb-3 border border-warning mt-3 rounded shadow-lg">
                                <div className="row">
                                    <div className="col-12 pt-2 pb-2 border-bottom border-warning">
                                        <div className="row">
                                            <FontAwesomeIcon className="col-sm-1 icon-size" icon={faUserCircle}/>
                                            <div className="col-sm-11 text-left pl-0 small font-weight-bold">Stellar account</div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <div className="row">
                                            <span className="col-sm-2 col-12 small text-left pt-2 pb-2 font-weight-bold">Public key : </span>
                                            <div className="col-sm-7 col-12 small text-center pt-2 pb-2 pr-0 pl-0">{this.state.public_key}</div>
                                            <a href={'/Components/ChangeAccount'} className="col-sm-3 col-12 text-hover2">
                                                <div className="pt-2 pb-2 small text-center bg-warning text-light rounded font-weight-bold">Change</div>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <div className="row">
                                            <span className="col-sm-2 col-12 small text-left pt-2 pb-2 font-weight-bold">KYC level : </span>
                                            <div className="col-sm-7 col-12 small text-center pt-2 pb-2">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="row">
                                                            <div className="col-12">24h transaction limit: 10,000,000 IRR</div>
                                                            <div className="col-12 diamond1-img mt-2"> </div>
                                                            <div className="col-12 mt-2">Level 1 (unverified)</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="row">
                                                            <div className="col-12">24h transaction limit: 150,000,000 IRR</div>
                                                            <div className="col-12 diamond2-img mt-2"> </div>
                                                            <div className="col-12 mt-2">Level 2 (verified)</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <a href={'/Components/Upgrade'} className="col-sm-3 col-12 text-hover2">
                                                <div className="pt-2 pb-2 small text-center bg-warning text-light rounded font-weight-bold">Upgrade</div>
                                            </a>
                                        </div>
                                    </div>
                                    {/*<div className="col-12 mt-3">*/}
                                        {/*<div className="row">*/}
                                            {/*<span className="col-sm-5 col-12 small text-left pt-2 pb-2 font-weight-bold">Transfer limitation : </span>*/}
                                            {/*<div className="col-sm-7 col-12 small text-left pt-2 pb-2 pr-0 pl-0">10,000,000 IRR<span className="font-weight-bold">*</span></div>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="col-12 mt-3 col-12 small pt-2 pb-2 text-left">*/}
                                        {/*<span className="font-weight-bold">*</span>You can increase your transfer limitation to 150,000,000 IRR by upgrading your KYC level <span className="font-weight-bold text-primary">More Info</span>.*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Profile;