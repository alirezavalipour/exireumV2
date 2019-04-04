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
import DepositXir from './Components/DepositXir.jsx';
import DepositXlm from './Components/DepositXlm.jsx';
import WithdrawedXir from './Components/WithdrawedXir.jsx';
import WithdrawedXlm from './Components/WithdrawedXlm.jsx';
import SendXirWithSheba from './Components/SendXirWithSheba.jsx';
import SendXirWithCard from './Components/SendXirWithCard.jsx';
import SendXlm from './Components/SendXlm.jsx';
import PayingTheBill from './Components/PayingTheBill.jsx';
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
                 <li><Link to="/Components/Verify">Verify</Link></li>
                 <li><Link to="/Components/ConfirmPassword">ConfirmPassword</Link></li>
                 <li><Link to="/Components/Dashboard">Dashboard</Link></li>
                 <li><Link to="/Components/DepositXir">DepositXir</Link></li>
                 <li><Link to="/Components/DepositXlm">DepositXlm</Link></li>
                 <li><Link to="/Components/WithdrawedXir">WithdrawedXir</Link></li>
                 <li><Link to="/Components/WithdrawedXlm">WithdrawedXlm</Link></li>
                 <li><Link to="/Components/SendXirWithSheba">SendXirWithSheba</Link></li>
                 <li><Link to="/Components/SendXirWithCard">SendXirWithCard</Link></li>
                 <li><Link to="/Components/SendXlm">SendXlm</Link></li>
                 <li><Link to="/Components/PayingTheBill">PayingTheBill</Link></li>
               </ul>
               <Route exact path="/Components/Login" component={Login}/>
               <Route path="/Components/Register" component={Register}/>
               <Route path="/Components/Verify" component={Verify}/>
               <Route path="/Components/ConfirmPassword" component={ConfirmPassword}/>
               <Route path="/Components/Dashboard" component={Dashboard}/>
               <Route path="/Components/DepositXir" component={DepositXir}/>
               <Route path="/Components/DepositXlm" component={DepositXlm}/>
               <Route path="/Components/WithdrawedXir" component={WithdrawedXir}/>
               <Route path="/Components/WithdrawedXlm" component={WithdrawedXlm}/>
               <Route path="/Components/SendXirWithSheba" component={SendXirWithSheba}/>
               <Route path="/Components/SendXirWithCard" component={SendXirWithCard}/>
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
