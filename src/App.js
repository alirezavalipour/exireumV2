import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
// import Login from './components/Login.jsx';
// import Register from './components/Register.jsx';
// import Verify from './components/Verify.jsx';
// import ConfirmPassword from './components/ConfirmPassword.jsx';
import { faIgloo , faHome  , faUser , faMoneyBill , faCode , faHighlighter , faNewspaper } from '@fortawesome/free-solid-svg-icons';
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

const Home = () => (
  <Container>
  <Row>
    <Col col="10"></Col>
    <Col col="2"></Col>
  </Row>
  <Row>
    <Col col="sm-3 12"></Col>
    <Col col="sm-6 12">
    <TradingViewWidget
      symbol="NASDAQ:AAPL"
      theme={Themes.DARK}
      locale="fr"
      autosize
    />
    </Col>
    <Col col="sm-3 12"></Col>
  </Row>
  <Row>
    <Col col="sm-3 12"></Col>
    <Col col="sm-6 12"></Col>
    <Col col="sm-3 12"></Col>
  </Row>
  </Container>
)

const About = () => (rounded
  <div>
    <h2>About</h2>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.path}/:topicId`} component={Topic}/>
    <Route exact path={match.path} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)
const BasicExample = () => (
  <Router>
    <Col col="sm-12">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </Col>
  </Router>
)

class App extends Component {
  render() {
    return (
        <div className="App">

        </div>
    );
  }
}

export default App;
