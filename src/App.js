import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import { Container, Row, Col } from 'bootstrap-4-react';
import { faIgloo , faHome  , faUser , faMoneyBill , faCode , faHighlighter , faNewspaper } from '@fortawesome/free-solid-svg-icons'
import {getTicksTotalFromSize} from "react-vis/es/utils/axis-utils";
library.add(
    faMoneyBill,
    faCode,
    faHighlighter,
    faUser,
    faHome,
    faIgloo,
    faNewspaper
    // more icons go here
);


class App extends Component {
  render() {
    return (
        <div className="App">
          <div className="col-12 wrapper">
            <div className="row">
            </div>
          </div>
        </div>
    );
  }
}

export default App;
