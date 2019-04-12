import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
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
import Cookies from 'universal-cookie';
import { faIgloo , faHome  , faUser , faMoneyBill , faCode , faHighlighter , faNewspaper } from '@fortawesome/free-solid-svg-icons';
library.add(
    faMoneyBill,
    faCode,
    faHighlighter,
    faUser,
    faHome,
    faIgloo,
    faNewspaper
);
const cookies = new Cookies();
cookies.set('reactUrl', 'true', { domain :'localhost' });


// const Home = () => (
//    <div>
//     <h2>Home</h2>
//    </div>
// )

// const About = () => (
//   <div>
//     <h2>About</h2>
//   </div>
// )

// const Topics = () => (
//   <div>
//     <h3>topic</h3>
//   </div>
// )

// const Topics = ({ match }) => (
//   <div>
//     <h2>Topics</h2>
//     <ul>
//       <li>
//         <Link to={`${match.url}/rendering`}>
//           Rendering with React
//         </Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/components`}>
//           Components
//         </Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/props-v-state`}>
//           Props v. State
//         </Link>
//       </li>
//     </ul>
//
//     <Route path={`${match.path}/:topicId`} component={Topic}/>
//     <Route exact path={match.path} render={() => (
//       <h3>Please select a topic.</h3>
//     )}/>
//   </div>
// )

class App extends Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   listDataFromChild: null
    // };
    //
    // this.callBackData = this.callBackData.bind(this);
  }

  // callBackData (dataFromChild){
  //   this.setState({
  //     listDataFromChild: dataFromChild
  //   });
  // }



  render() {

      let header="";
      if(window.location.pathname == "/Components/Login" || window.location.pathname == "/Components/Register" || window.location.pathname == "/Components/Verify" || window.location.pathname == "/Components/ConfirmPassword" || window.location.pathname == "/Components/Account")
      {
          header = <div className="col-12 header2 mb-5">
                      <div className="row">
                          <div className="logo col-sm-2 col-12"></div>
                          <div className="col-sm-10 col-12"></div>
                      </div>
                  </div>;
      }
      else if(window.location.pathname == "/Components/Dashboard" || window.location.pathname == "/Components/ExchangeXir" || window.location.pathname == "/Components/ExchangeXlm" || window.location.pathname == "/Components/DepositXirWithIpg" || window.location.pathname == "/Components/DepositXirWithQr" || window.location.pathname == "/Components/DepositXlm" || window.location.pathname == "/Components/WithdrawedXirWithSheba" || window.location.pathname == "/Components/SendXir" || window.location.pathname == "/Components/SendXlm" || window.location.pathname == "/Components/PayingTheBill")
      {
          header = <div className="col-12 header1 mb-5">
                      <div className="row">
                          <div className="logo col-sm-2 col-12"></div>
                          <div className="menu col-sm-7 col-12">
                              <div className="row">
                                  <a className={'menu-in ml-3 text-light' + (window.location.pathname === '/Components/Dashboard' ? ' activation' : '')} href="/Components/Dashboard">Dashboard</a>
                                  <a className={'menu-in ml-4 text-light' + (window.location.pathname === '/Components/Orders' ? ' activation' : '')} href="#">Orders</a>
                              </div>
                          </div>
                          <div className="user col-sm-3 col-12"></div>
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
             </div>
           </div>
          </Router>
        </div>
    );
  }
}

export default App;
