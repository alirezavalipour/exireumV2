import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {} from 'bootstrap-4-react';
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
import ChangeAccount from './Components/ChangeAccount.jsx';
import Ticket from './Components/Ticket.jsx';
import TrustFailed from './Components/TrustFailed.jsx';
import TransactionFailed from './Components/TransactionFailed.jsx';
import TransactionSuccess from './Components/TransactionSuccess.jsx';
import Upgrade from './Components/Upgrade.jsx';
import PersonalInfo from './Components/PersonalInfo.jsx';
import Cookies from 'universal-cookie';
import {faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import AuthService from "./Components/AuthService";
import { Offline } from "react-detect-offline";
var jwtDecode = require('jwt-decode');
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

    componentWillMount() {
      if(window.location.href === "https://my.exireum.com/" || window.location.href === "http://localhost:3000/")
      {
          if (this.Auth.loggedIn()) {
              window.location.replace('/Components/Dashboard');
          }
          else
          {
              window.location.replace('/Components/Login');
          }
      }

      if(window.location.pathname === "/Components/Dashboard" || window.location.pathname === "/Components/Orders" || window.location.pathname === "/Components/Ticket" || window.location.pathname === "/Components/Profile")
      {
          document.querySelector("body").setAttribute('class','back-ground');
      }
    }

  componentDidMount() {
    const url = this.Auth.getDomain() + '/user/profile';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Auth.getToken()}`,
    };
    if(this.Auth.getToken()) {
        var decode = jwtDecode(this.Auth.getToken());
        var expTime = decode.exp;
        var nowTime = Math.round((new Date()).getTime() / 1000);
        if (expTime < nowTime) {
            localStorage.removeItem('id_token');
            localStorage.removeItem('mobile');
            cookies.remove('reactUrl', {domain: '.exireum.com', path: '/'});
            window.location.replace('https://exireum.com');
        }
    }
    var config = { headers };
    return axios.get(url, config)
        .then(response => {
          this.setState({
            name: response.data.username.charAt(0).toUpperCase()
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
      cookies.remove('reactUrl', { domain :'.exireum.com' , path: '/' });
      window.location.replace('https://exireum.com');
  }

  render() {

    let item = <div className="sub-user-none rounded-bottom">
          <a className="text-center text-hover">Profile</a>
          <a className="text-center text-hover">Logout</a>
    </div>;
    if(this.state.key === false)
    {
      item = <div className="sub-user-none rounded-bottom">
            <a className="text-center text-hover">Profile</a>
            <a className="text-center text-hover">Logout</a>
      </div>;
    }else
    {
      item = <div className="sub-user rounded-bottom">
            <a className="text-center text-hover" onClick={this.goProfile}><FontAwesomeIcon className="mr-2 icon" icon={faUser}/>Profile</a>
            <a className="text-center text-hover" onClick={this.logOut}><FontAwesomeIcon className="mr-2 icon" icon={faSignOutAlt}/>Logout</a>
      </div>;
    }

    // let icon = <div className="icon-user col-4 text-left bg-warning pt-2 pb-2 mt-2 mb-2 rounded-right">
    //   <FontAwesomeIcon className="" icon={faUser}/>
    //   <FontAwesomeIcon className="ml-2" icon={faAngleDown}/>
    // </div>;
    // if(this.state.key === false)
    // {
    //   icon = <div className="icon-user col-4 text-left bg-warning pt-2 pb-2 mt-2 mb-2 rounded-right">
    //     <FontAwesomeIcon className="" icon={faUser}/>
    //     <FontAwesomeIcon className="ml-2" icon={faAngleDown}/>
    //   </div>;
    // }
    // else {
    //   icon = <div className="icon-user col-4 text-left bg-warning pt-2 pb-2 mt-2 mb-2 rounded-right">
    //     <FontAwesomeIcon className="" icon={faUser}/>
    //     <FontAwesomeIcon className="ml-2" icon={faAngleUp}/>
    //   </div>
    // }

      let header="";
      if(window.location.pathname === "/Components/Login" || window.location.pathname === "/Components/TrustFailed" || window.location.pathname === "/Components/ResetPassword" || window.location.pathname === "/Components/Register" || window.location.pathname === "/Components/Verify" || window.location.pathname === "/Components/Confirmpassword" || window.location.pathname === "/Components/Account")
      {
          header = <div className="col-12 header2 small">
                      <div className="row">
                          <a href="https://exireum.com" className="logo col-sm-2 col-12"></a>
                          <div className="col-sm-10 col-12"></div>
                      </div>
                  </div>;
      }
      else if(window.location.pathname === "/Components/Dashboard" || window.location.pathname === "/Components/PersonalInfo" || window.location.pathname === "/Components/ChangeAccount"  || window.location.pathname === "/Components/Upgrade" || window.location.pathname === "/Components/TransactionSuccess" || window.location.pathname === "/Components/TransactionFailed" || window.location.pathname === "/Components/Ticket" || window.location.pathname === "/Components/ExchangeXir" || window.location.pathname === "/Components/ExchangeXlm" || window.location.pathname === "/Components/DepositXirWithIpg" || window.location.pathname === "/Components/DepositXirWithQr" || window.location.pathname === "/Components/DepositXlm" || window.location.pathname === "/Components/WithdrawedXirWithSheba" || window.location.pathname === "/Components/SendXir" || window.location.pathname === "/Components/SendXlm" || window.location.pathname === "/Components/PayingTheBill" || window.location.pathname === "/Components/Orders" || window.location.pathname === "/Components/Profile")
      {
          header = <div className="col-12 header1">
                        <div className="row">
                            <a href="https://exireum.com" className="logo col-sm-2 col-12"></a>
                            <div className="col-sm-10 col-12">
                                <div className="row">
                                    <a className={'col-sm-1 col-12 menu-in text-light pt-2 pb-2 mt-1 text-center pr-0 pl-0' + (window.location.pathname === '/Components/Dashboard' ? ' activation' : '')} href="/Components/Dashboard">Dashboard</a>
                                    <div className="d-none d-sm-block col-sm-8"> </div>
                                    <a className={'col-sm-1 col-12 col-12 menu-in text-light pt-2 pb-2 mt-1 text-center pr-0 pl-0' + (window.location.pathname === '/Components/Orders' ? ' activation' : '')} href="/Components/Orders">History</a>
                                    <a className={'col-sm-1 col-12 menu-in text-light pt-2 pb-2 mt-1 text-center pr-0 pl-0' + (window.location.pathname === '/Components/Ticket' ? ' activation' : '')} href="/Components/Ticket">Support</a>
                                    <a className="col-sm-1 col-12 text-center name-cursor" onClick={this.checkedItem}><div className="pro-name mt-2 mb-2 font-weight-bold mx-auto rounded2 text-center bg-warning">{this.state.name}</div></a>
                                </div>
                                {item}
                            </div>
                        </div>
                    </div>;
      }

    return (
        <div className="App">
            {header}
            <div className="text-center text-light col-8 mx-auto">
                <Offline><div className="col-12 mb-5 bg-danger pt-2 pb-2 rounded shadow-lg">Network error you are offline</div></Offline>
            </div>
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
                <Route path="/Components/ChangeAccount" component={ChangeAccount}/>
                <Route path="/Components/TrustFailed" component={TrustFailed}/>
                <Route path="/Components/Ticket" component={Ticket}/>
                <Route path="/Components/TransactionSuccess" component={TransactionSuccess}/>
                <Route path="/Components/TransactionFailed" component={TransactionFailed}/>
                <Route path="/Components/Upgrade" component={Upgrade}/>
                <Route path="/Components/PersonalInfo" component={PersonalInfo}/>
             </div>
           </div>
          </Router>
        </div>
    );
  }
}

export default App;
