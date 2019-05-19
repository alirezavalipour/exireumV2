import React, {Component} from 'react';
import '../App.css';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';

class TransactionSuccess extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.state = {}
    }

    render() {
        return(
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <h2 className="col-12 text-center text-light mb-5 font-weight-bold">Transaction success</h2>
                    <div className="col-12 text-center text-light p-2">Your transaction has been done successfully.</div>
                    <a href="../Components/Dashboard" className='col-sm-4 col-12 text-center text-light pt-2 pb-2 mt-3 bg-warning mx-auto rounded shadow-lg'>Back to dashboard</a>
                </div>
            </div>
        );
    }
}
export default TransactionSuccess;