import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import Register from "./Register";

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <div className="col-sm-5 col-12 border border-light text-center bg-white rounded shadow-lg mt-2">
                        <div className="row">
                            <h2 className="col-12">XIR</h2>
                            {/*<div className="col-12">*/}
                                {/*<div className="row">*/}
                                    {/*<div className="col-6">Remind of XIR :</div>*/}
                                    {/*<div className="col-6">10000</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            <a href="#" className="col-12 border-top border-dark pt-2 pb-2">Withdrawed XIR</a>
                            <a href="#" className="col-12 border-top border-dark pt-2 pb-2">Deposit XIR</a>
                            <a href="#" className="col-12 border-top border-dark pt-2 pb-2">Send XIR with sheba</a>
                            <a href="#" className="col-12 border-top border-dark pt-2 pb-2">Send XIR with card number</a>
                            <a href="#" className="col-12 border-top border-dark pt-2 pb-2">Paying the bill</a>
                        </div>
                    </div>
                    <div className="col-sm-2 col-12"></div>
                    <div className="col-sm-5 col-12 border border-light text-center bg-white rounded shadow-lg mt-2">
                        <div className="row">
                            <h2 className="col-12">XLM</h2>
                            {/*<div className="col-12">*/}
                                {/*<div className="row">*/}
                                    {/*<div className="col-6">Remind of XLM :</div>*/}
                                    {/*<div className="col-6">10000</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            <a href="#" className="col-12 border-top border-dark pt-2 pb-2">Withdrawed XLM</a>
                            <a href="#" className="col-12 border-top border-dark pt-2 pb-2">Deposit XLM</a>
                            <a href="#" className="col-12 border-top border-dark pt-2 pb-2">Send XLM</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
