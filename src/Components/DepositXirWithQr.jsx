import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class DepositXirWithQr extends Component {

    constructor() {
        super();
    }

    render() {
        return(
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <h2 className="col-12 text-light text-center">Deposit XIR With QR</h2>
                    <div className="col-lg-3 col-md-3 col-sm-5 col-8 qr-image mt-2 clearfix mx-auto"></div>
                </div>
            </div>
        );
    }
}
export default DepositXirWithQr;