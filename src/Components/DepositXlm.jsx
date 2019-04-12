import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Clipboard from 'react-clipboard.js';
var QRCode = require('qrcode.react');

class DepositXlm extends Component {

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
            <div className="col-sm-7 col-12 clearfix mx-auto">
                <div className="row">
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Deposit XLM With QR</h2>
                    <div className="col-12 p-2">
                        <QRCode
                            className="d-flex mx-auto"
                            value={this.state.public_key}
                            size="150"
                            level="L"
                            includeMargin="true"
                            bgColor="#fff"
                            fgColor="#151d2e"
                        />
                    </div>
                    <div className="col-12 p-2 mt-3">
                        <div className="row">
                            <div className="text-center col-9 p-2 border-div rounded-left shadow-lg">{this.state.public_key}</div>
                            <Clipboard className="text-center col-3 bg-warning font-weight-bold border border-warning rounded-right shadow-lg" option-text={this.getText} onSuccess={this.onSuccess}>
                                Copy to clipboard
                            </Clipboard>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default DepositXlm;