import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Clipboard from 'react-clipboard.js';
var QRCode = require('qrcode.react');

class DepositXirWithQr extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.onSuccess = this.onSuccess.bind(this);
        this.getText = this.getText.bind(this);
        this.state = {
            public_key: "",
        }
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount() {
        const urlPublic = this.Auth.getDomain() + '/user/account';
        const headersPublic = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configPublic = { headers: headersPublic };
        return axios.get(urlPublic, configPublic)
            .then(response => {
                this.setState({
                    public_key: response.data[0].public_key
                });
            });
    }

    onSuccess() {
        console.info('successfully copied');
    }

    getText() {
        return this.state.public_key;
    }

    render() {

        return(
            <div className="col-12">
                <div className="row">
                    <div className="col-12 alireza">
                        <div className="col-sm-8 col-12 clearfix mx-auto mt-5 mb-5">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-sm-9 col-12 bg-light mx-auto rounded shadow-lg mt-3 small pb-2">
                                            <div className="row">
                                                <div className="col-12 mt-2 text-center">To deposit XIR,</div>
                                                <div className="col-12 mt-2 mb-2 text-center">You can use your public-key to buy XIR.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="col-sm-8 col-12 clearfix mx-auto border border-warning shadow-lg rounded mt-3 mb-3">
                            <div className="row">
                                <div className="col-12 border-bottom border-warning">
                                    <div className="row mt-2 mb-2">
                                        <div className="col-sm-1 d-none d-sm-block icon10"> </div>
                                        <div className="col-sm-11 pl-0 d-none d-sm-block small font-weight-bold">Deposit XIR with QR</div>
                                        <div className="col-12 d-sm-none d-bolck small font-weight-bold">Deposit XIR with QR</div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="col-12">
                                        <QRCode className="d-flex mx-auto" value={this.state.public_key} size="150" level="L" includeMargin="true" bgColor="#fff" fgColor="#151d2e"/>
                                    </div>
                                    <div className="col-12 mt-3 mb-3">
                                        <div className="row">
                                            <div className="col-sm-9 d-none d-sm-block text-center pt-1 pb-1 border-div2 rounded-left">{this.state.public_key}</div>
                                            <div className="col-12 d-sm-none d-block text-center pt-1 pb-1 border-div4 rounded mb-1 word-wrap">{this.state.public_key}</div>
                                            <Clipboard className="col-sm-3 d-none d-sm-block text-center bg-warning font-weight-bold rounded-right small" option-text={this.getText} onSuccess={this.onSuccess}>Copy to clipboard</Clipboard>
                                            <Clipboard className="col-12 d-sm-none d-block pt-1 pb-1 text-center bg-warning font-weight-bold rounded small" option-text={this.getText} onSuccess={this.onSuccess}>Copy to clipboard</Clipboard>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default DepositXirWithQr;