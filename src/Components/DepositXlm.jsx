import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {} from 'bootstrap-4-react';
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
            <div className="col-sm-7 col-12 clearfix mx-auto">
                <div className="row">
                    <h4 className="col-12 text-light text-center mt-5 mb-5">Deposit XLM With QR</h4>
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
                    <div className="col-12 mt-3">
                        <div className="row">
                            <a href="https://btcbit.net/buy-stellar-lumen-xlm-with-credit-card" target="_blank" className="col-sm-4 col-12">
                                <div className="row">
                                    <div className="col-12 btc-img"></div>
                                    <div className="col-12 text-center text-white">BTC BIT</div>
                                </div>
                            </a>
                            <a href="https://coinswitch.co/coins/stellar-lumens/buy-stellar-lumens-worldwide" target="_blank" className="col-sm-4 col-12">
                                <div className="row">
                                    <div className="col-12 swtich-img"></div>
                                    <div className="col-12 text-center text-white">COIN SWITCH</div>
                                </div>
                            </a>
                            <a href="https://cex.io/cards-xlm/" target="_blank" className="col-sm-4 col-12">
                                <div className="row">
                                    <div className="col-12 cex-img"></div>
                                    <div className="col-12 text-center text-white">CEX IO</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default DepositXlm;