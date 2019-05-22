import React, { Component } from 'react';
import '../App.css';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';

class Upgrade extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleClickButton = this.handleClickButton.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            load1: false,
            load2: false,
        }
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleClickButton(e)
    {
        e.preventDefault();
        this.setState({
           load1: !this.state.load1,
        });
    }

    render() {
        let loader = "";
        if (this.state.load1 === false)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if (this.state.load1 === true)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        return (
            <div className="col-sm-8 col-12 clearfix mx-auto">
                <div className="row">
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Upgrade</h2>
                    <form className="col-12" onSubmit={this.handleClickButton}>
                        <label className='col-12'>
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 rounded-left bg-warning">KYC public key</span>
                                <input required='required' className="col-9 text-center rounded-right p-2" placeholder="GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO" name="public_key" type="text" onChange={this.handleChange}/>
                            </div>
                        </label>
                        <label className='col-12 mt-3'>
                            <div className="row shadow-lg">
                                <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Memo</span>
                                <input required='required' className="col-9 text-center rounded-right p-2" placeholder="GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO" name="memo" type="text" onChange={this.handleChange}/>
                            </div>
                        </label>
                        {loader}
                    </form>
                </div>
            </div>
        );
    }
}

export default Upgrade;