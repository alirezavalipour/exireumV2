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
        <div className="App bg-secondary mh-100">
          <Router>
           <div className="col-12">
             <div className="row">
               <ul className="col-12">
                 <li><Link to="/Components/Login">Login</Link></li>
                 <li><Link to="/Components/Register">Sign In</Link></li>
               </ul>
               <Route exact path="/Components/Login" component={Login}/>
               <Route path="/Components/Register" component={Register}/>
             </div>
           </div>
          </Router>
        </div>
    );
  }
}

export default App;
