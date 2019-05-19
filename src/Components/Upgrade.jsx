import React, { Component } from 'react';
import '../App.css';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class Upgrade extends Component {

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

    render() {
        return (
            <div></div>
        );
    }
}

export default Upgrade;