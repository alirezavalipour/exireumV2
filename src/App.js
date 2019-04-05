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
import WithdrawedXlm from './Components/WithdrawedXlm.jsx';
import ExchangeXir from './Components/ExchangeXir.jsx';
import WithdrawedXirWithSend from './Components/WithdrawedXirWithSend.jsx';
import ExchangeXlm from './Components/ExchangeXlm.jsx';
import PayingTheBill from './Components/PayingTheBill.jsx';
import Account from './Components/Account.jsx';
import Dashboard from './Components/Dashboard.jsx';
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
  render() {
    return (
        <div className="App">
          <Router>
           <div className="col-12">
             <div className="row">
               <ul className="col-12">
                 <li><Link to="/Components/Login">Login</Link></li>
                 <li><Link to="/Components/Register">Sign In</Link></li>
               </ul>
               <Route exact path="/Components/Login" component={Login}/>
               <Route path="/Components/Register" component={Register}/>
               <Route path="/Components/Verify" component={Verify}/>
               <Route path="/Components/ConfirmPassword" component={ConfirmPassword}/>
               <Route path="/Components/Dashboard" component={Dashboard}/>
               <Route path="/Components/ExchangeXir" component={ExchangeXir}/>
               <Route path="/Components/ExchangeXlm" component={ExchangeXlm}/>
               <Route path="/Components/DepositXirWithIpg" component={DepositXirWithIpg}/>
               <Route path="/Components/DepositXirWithQr" component={DepositXirWithQr}/>
               <Route path="/Components/DepositXlm" component={DepositXlm}/>
               <Route path="/Components/WithdrawedXirWithSheba" component={WithdrawedXirWithSheba}/>
               <Route path="/Components/WithdrawedXirWithSend" component={WithdrawedXirWithSend}/>
               <Route path="/Components/WithdrawedXlm" component={WithdrawedXlm}/>
               <Route path="/Components/PayingTheBill" component={PayingTheBill}/>
               <Route path="/Components/Account" component={Account}/>
             </div>
           </div>
          </Router>
        </div>
    );
  }
}

export default App;
