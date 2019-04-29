import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from 'bootstrap-4-react';
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';
import Verify from './Components/Verify.jsx';
import ConfirmPassword from './Components/ConfirmPassword.jsx';
import DepositXirWithIpg from './Components/DepositXirWithIpg.jsx';
import DepositXirWithQr from './Components/DepositXirWithQr.jsx';
import DepositXlm from './Components/DepositXlm.jsx';
import WithdrawedXirWithSheba from './Components/WithdrawedXirWithSheba.jsx';
import SendXlm from './Components/SendXlm.jsx';
import ExchangeXir from './Components/ExchangeXir.jsx';
import SendXir from './Components/SendXir.jsx';
import ExchangeXlm from './Components/ExchangeXlm.jsx';
import PayingTheBill from './Components/PayingTheBill.jsx';
import Account from './Components/Account.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Orders from './Components/Orders.jsx';
import ResetPassword from './Components/ResetPassword.jsx';
import Profile from './Components/Profile.jsx';
import Trust from './Components/Trust.jsx';
import Cookies from 'universal-cookie';
import { faUser , faAngleUp , faAngleDown } from '@fortawesome/free-solid-svg-icons';
import AuthService from "./Components/AuthService";
const cookies = new Cookies();

class App extends Component {

  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.checkedItem = this.checkedItem.bind(this);
    this.logOut = this.logOut.bind(this);
    this.goProfile = this.goProfile.bind(this);
    this.state = {
      // listDataFromChild: null
      name: null,
      key: false
    };
    //
    // this.callBackData = this.callBackData.bind(this);
  }

  // callBackData (dataFromChild){
  //   this.setState({
  //     listDataFromChild: dataFromChild
  //   });
  // }

    goProfile(e)
    {
        e.preventDefault();
        window.location.replace('/Components/Profile');

    }

  componentDidMount() {
    const url = this.Auth.getDomain() + '/user/profile';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Auth.getToken()}`,
    };
    var config = { headers };
    return axios.get(url, config)
        .then(response => {
          this.setState({
            name: response.data.username
          });
        });
  }

  checkedItem(e) {
    e.preventDefault();
    this.setState({
      key: !this.state.key,
    });
  }

  logOut(e){
      e.preventDefault();
      this.Auth.logout();
      cookies.remove('reactUrl', { domain :'https://exireum.com' , path: '/' });
      window.location.replace('https://exireum.com');
  }

  render() {

    let item = <div className="sub-user-none col-12">
      <div className="row">
        <a className="col-6 text-center"><div className="col-12 font-weight-bold">Logout</div></a>
        <a className="col-6 text-center text-light text-decoration-none"><div className="col-12 font-weight-bold">Profile</div></a>
      </div>
    </div>;
    if(this.state.key == false)
    {
      item = <div className="sub-user-none col-12 d-none">
        <div className="row">
          <a className="col-6 text-center"><div className="col-12 font-weight-bold">Logout</div></a>
          <a className="col-6 text-center text-light text-decoration-none"><div className="col-12 font-weight-bold">Profile</div></a>
        </div>
      </div>;
    }else
    {
      item = <div className="sub-user col-12 pr-5 pl-5 pt-3 pb-3">
        <div className="row">
          <a className="col-6 text-center" onClick={this.logOut}><div className="col-12 font-weight-bold">Logout</div></a>
          <a onClick={this.goProfile} className="col-6 text-center text-light text-decoration-none"><div className="col-12 font-weight-bold">Profile</div></a>
        </div>
      </div>;
    }

    let icon = <div className="icon-user col-4 text-left">
      <FontAwesomeIcon className="" icon={faUser}/>
      <FontAwesomeIcon className="ml-2" icon={faAngleUp}/>
    </div>;
    if(this.state.key == false)
    {
      icon = <div className="icon-user col-4 text-left">
        <FontAwesomeIcon className="" icon={faUser}/>
        <FontAwesomeIcon className="ml-2" icon={faAngleUp}/>
      </div>;
    }else
    {
      icon = <div className="icon-user col-4 text-left">
        <FontAwesomeIcon className="" icon={faUser}/>
        <FontAwesomeIcon className="ml-2" icon={faAngleDown}/>
      </div>
    }

      let header="";
      if(window.location.pathname == "/Components/Login" || window.location.pathname == "/Components/Trust" || window.location.pathname == "/Components/ResetPassword" || window.location.pathname == "/Components/Register" || window.location.pathname == "/Components/Verify" || window.location.pathname == "/Components/Confirmpassword" || window.location.pathname == "/Components/Account")
      {
          header = <div className="col-12 header2 mb-5">
                      <div className="row">
                          <a href="https://exireum.com" className="logo col-sm-2 col-12"></a>
                          <div className="col-sm-10 col-12"></div>
                      </div>
                  </div>;
      }
      else if(window.location.pathname == "/Components/Dashboard" || window.location.pathname == "/Components/ExchangeXir" || window.location.pathname == "/Components/ExchangeXlm" || window.location.pathname == "/Components/DepositXirWithIpg" || window.location.pathname == "/Components/DepositXirWithQr" || window.location.pathname == "/Components/DepositXlm" || window.location.pathname == "/Components/WithdrawedXirWithSheba" || window.location.pathname == "/Components/SendXir" || window.location.pathname == "/Components/SendXlm" || window.location.pathname == "/Components/PayingTheBill" || window.location.pathname == "/Components/Orders" || window.location.pathname == "/Components/Profile")
      {
          header = <div className="col-12 header1 mb-5">
                      <div className="row">
                          <a href="https://exireum.com" className="logo col-sm-2 col-12"></a>
                          <div className="menu col-sm-7 col-12">
                              <div className="row">
                                  <a className={'menu-in ml-3 text-light' + (window.location.pathname === '/Components/Dashboard' ? ' activation' : '')} href="/Components/Dashboard">Dashboard</a>
                                  <a className={'menu-in ml-4 text-light' + (window.location.pathname === '/Components/Orders' ? ' activation' : '')} href="/Components/Orders">Orders</a>
                              </div>
                          </div>
                          <a className="user col-sm-3 col-12 text-light text-right" onClick={this.checkedItem}>
                            <div className="row">
                              <div className="name-user col-8 text-right font-weight-bold">{this.state.name}</div>
                              {icon}
                              {item}
                            </div>
                          </a>
                      </div>
                  </div>;
      }

    return (
        <div className="App">
            {header}
          <Router>
           <div className="col-12">
             <div className="row">
                <Route exact path="/Components/Login" component={Login}/>
                <Route path="/Components/Register" component={Register}/>
                <Route path="/Components/Verify" component={Verify}/>
                <Route path="/Components/ConfirmPassword" component={ConfirmPassword}/>
                <Route path="/Components/Account" component={Account}/>
                <Route path="/Components/Dashboard" component={Dashboard} />
                <Route path="/Components/ExchangeXir" component={ExchangeXir}/>
                <Route path="/Components/ExchangeXlm" component={ExchangeXlm}/>
                <Route path="/Components/DepositXirWithIpg" component={DepositXirWithIpg}/>
                <Route path="/Components/DepositXirWithQr" component={DepositXirWithQr}/>
                <Route path="/Components/DepositXlm" component={DepositXlm}/>
                <Route path="/Components/WithdrawedXirWithSheba" component={WithdrawedXirWithSheba}/>
                <Route path="/Components/SendXir" component={SendXir}/>
                <Route path="/Components/SendXlm" component={SendXlm}/>
                <Route path="/Components/PayingTheBill" component={PayingTheBill}/>
                <Route path="/Components/Orders" component={Orders}/>
                <Route path="/Components/Profile" component={Profile}/>
                <Route path="/Components/ResetPassword" component={ResetPassword}/>
                <Route path="/Components/Trust" component={Trust}/>
             </div>
           </div>
          </Router>
        </div>
    );
  }
}

export default App;
