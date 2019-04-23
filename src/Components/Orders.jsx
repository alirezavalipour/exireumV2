import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Container, Row, Col} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class Orders extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.state = {}
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount() {
        const url = this.Auth.getDomain() + '/user/account';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.get(url, config)
            .then(response => {
                this.assetAmount(response.data[0].public_key);
            });
    }

    render() {
        return(
            <div></div>
        );
    }
}
export default Orders;