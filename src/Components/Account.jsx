import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';
var StellarSdk = require('stellar-sdk');

const isValidSecretKey = input => {
    try {
        StellarSdk.Keypair.fromSecret(input);
        return true;
    } catch (e) {
        // console.error(e);
        return false;
    }
};

const isValidPublicKey = input => {
    try {
        StellarSdk.Keypair.fromPublicKey(input);
        return true;
    } catch (e) {
        // console.error(e);
        return false;
    }
};

class Account extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit1 = this.handleFormSubmit1.bind(this);
        this.handleFormSubmit2 = this.handleFormSubmit2.bind(this);
        this.acceptTerm = this.acceptTerm.bind(this);
        this.acceptTerm2 = this.acceptTerm2.bind(this);
        this.acceptTerm3 = this.acceptTerm3.bind(this);
        this.signXdr = this.signXdr.bind(this);
        this.changeForm1 = this.changeForm1.bind(this);
        this.changeForm2 = this.changeForm2.bind(this);
        this.showPlacholder = this.showPlacholder.bind(this);
        this.hidPlacholder = this.hidPlacholder.bind(this);
        this.state = {
            err: "",
            change: "",
            newKeypair: 'null',
            termsAccepted: false,
            term1: false,
            term2: false,
            term3: false,
            load: false,
            inValidSecretKey: false,
            inValidPublicKey: false,
            change1: true,
            change2: false
        };
        this.handleGenerate = event => {
            let keypair = StellarSdk.Keypair.random();
            this.setState({
                newKeypair: {
                    pubKey: keypair.publicKey(),
                    secretKey: keypair.secret(),
                }
            });
        }
    }

    componentWillMount() {
        if (!this.Auth.loggedIn()) {
            window.location.replace('/Components/Login');
        }
        const urlPublic = this.Auth.getDomain() + '/user/account';
        const headersPublic = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var configPublic = { headers: headersPublic };
        return axios.get(urlPublic, configPublic)
            .then(response => {
                this.setState({
                    public_key: response.data[0].public_key
                });
                if (this.state.public_key)
                {
                    window.location.replace('/Components/Dashboard');
                }
            });
    }

    changeForm1(e)
    {
        e.preventDefault();
        this.setState({
            change1: true,
            change2: false
        });
        e.currentTarget.setAttribute("class", "col-6 text-light text-center font-weight-bold rounded-top border-top border-right border-left border-warning pt-3 pb-3");
        document.getElementById('create').setAttribute("class","col-6 text-light text-center font-weight-bold rounded-top border-bottom border-warning pt-3 pb-3 hover-tab");
    }

    changeForm2(e)
    {
        e.preventDefault();
        this.setState({
            change2: true,
            change1: false
        });
        e.currentTarget.setAttribute("class", "col-6 text-light text-center font-weight-bold rounded-top border-top border-right border-left border-warning pt-3 pb-3");
        document.getElementById('add').setAttribute("class","col-6 text-light text-center font-weight-bold rounded-top border-bottom border-warning pt-3 pb-3 hover-tab");
    }

    showPlacholder(e)
    {
        e.preventDefault();
        e.currentTarget.children[0].children[0].setAttribute("class", "enable text-left text-light placholder pr-2 pl-2");
        e.currentTarget.children[0].children[1].setAttribute('placeholder','');
    }

    hidPlacholder(e)
    {
        e.preventDefault();
        if(!e.currentTarget.children[0].children[1].value)
        {
            e.currentTarget.children[0].children[0].setAttribute("class" , "disable");
            e.currentTarget.children[0].children[1].setAttribute('placeholder',e.currentTarget.children[0].children[1].dataset.input);
        }
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });


        // console.log(this.state.public_key);
        // this.someFn(this.state.public_key);
    }

    handleFormSubmit1(e) {
        e.preventDefault();
        if(!isValidSecretKey(this.state.secret_key)  && isValidPublicKey(this.state.public_key))
        {
            this.setState({
                inValidSecretKey: true,
            });
            return true;
        }
        else if(isValidSecretKey(this.state.secret_key)  && !isValidPublicKey(this.state.public_key))
        {
            this.setState({
                inValidPublicKey: true,
            });
            return true;
        }
        if (!(isValidSecretKey(this.state.secret_key)  && isValidPublicKey(this.state.public_key))) {
            this.setState({
                inValidSecretKey: true,
                inValidPublicKey: true,
            });
            return true;
        }
        this.setState({
            load: !this.state.load
        });
        const url = this.Auth.getDomain() + '/user/account/add';
        const formData = {
            public_key: this.state.public_key,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        axios.post(url, formData, config)
            .then(response =>{
                if(response.status === 200) {
                    this.acceptAsset(this.state.public_key);
                }
            });
    }

    handleFormSubmit2(e) {
        e.preventDefault();
        const url = this.Auth.getDomain() + '/user/account/create';
        const formData = {
            public_key: this.state.newKeypair.pubKey,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response =>{
                if(response.status === 200){
                    this.setState({
                        order: response.data.order_id
                    });
                    window.location.replace(this.Auth.getDomain()+"/user/order/pay/" +  this.state.order);
                }
            });
    }

    acceptAsset(x)
    {
        const url = this.Auth.getDomain() + '/user/stellar/asset/accept';
        const formData= {
            public_key: x,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        axios.post(url, formData, config)
            .then(response =>{
                if(response.status === 200){
                    this.signXdr(response.data.xdr);
                }
            });
    }

    signXdr(xdr){
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        let keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key);
        //console.log(keypair);
        // let xdr = StellarSdk.xdr.TransactionEnvelope.fromXDR(this.state.xdr,'base64');
        let transaction = new StellarSdk.Transaction(xdr);
        transaction.sign(keypair);
        let xdr1 = transaction.toEnvelope().toXDR('base64');
        const url = this.Auth.getDomain() + '/user/stellar/asset/accept/submit';
        const formData = {
            xdr: xdr1,
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response =>{
                if(response.status === 200){
                    window.location.replace('/Components/Dashboard');
                }
            })
    }

    acceptTerm(e){
        this.setState( {
            term1: !this.state.term1,
            term2: false,
            term3: false,
        });
    }

    acceptTerm2(e){
        this.setState( {
            term2: !this.state.term2,
            term1: false,
        });
    }

    acceptTerm3(e){
        this.setState( {
            term3: !this.state.term3,
            term1: false,
        });
    }

    // someFn (public_key) {
    //     console.log(public_key);
    //     this.props.callbackFromParent(public_key);
    // }

    render() {
        let valid = "";
        if(this.state.inValidSecretKey === true && this.state.inValidPublicKey === false)
        {
            valid = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your Secret key invalid
                </div>
            </div>;
        }
        else if(this.state.inValidPublicKey === true && this.state.inValidSecretKey === false)
        {
            valid = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your Public key invalid
                </div>
            </div>;
        }
        else if(this.state.inValidPublicKey === true && this.state.inValidSecretKey === true)
        {
            valid = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your Public key and Secret key invalid
                </div>
            </div>;
        }
        let loader = "";
        if(this.state.load === false)
        {
            loader = <button className="mb-3 col-12 bg-warning p-2 rounded mt-2 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load === true)
        {
            loader = <button className="mb-3 col-12 bg-warning p-2 rounded mt-2 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        let acceptShow1 = <div className="mb-3 col-12 p-2 mt-2 border-div rounded shadow-lg text-center">SUBMIT</div>;
        if(this.state.term1 && !this.state.term3 && !this.state.term2)
        {
            acceptShow1 = loader;
        }
        let acceptShow2 = <div className="mb-3 col-12 p-2 mt-2 border-div rounded shadow-lg text-center">SUBMIT</div>;
        if(!this.state.term1 && this.state.term3 && this.state.term2)
        {
            acceptShow2 = loader;
        }
        let account = <form autoComplete='off' className="col-12 border-bottom border-right border-left border-warning" onSubmit={this.handleFormSubmit1}>
                        <div className="col-12" onFocus={this.showPlacholder} onBlur={this.hidPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="public_key">Public key</label>
                                <input data-input="Public key : GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO" autoComplete="off" className="col-12 mt-4 p-2 rounded shadow-lg" placeholder="Public key : GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO" name="public_key" required="required" type="text" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="col-12" onFocus={this.showPlacholder} onBlur={this.hidPlacholder}>
                            <div className="row">
                                <label className="disable" htmlFor="secret_key">Secret key</label>
                                <input data-input="Secret key : SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" autoComplete="off" className="col-12 mt-3 p-2 rounded shadow-lg" placeholder="Secret key : SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" required="required" type="text" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="p-2 mt-3 col-12">
                            <input type="checkbox" id="Choice3" name="accept" value="accept" onChange={this.acceptTerm}/>
                            <label className="col-5 text-light" htmlFor="Choice3"><a href="#" className="text-light">Accept term and conditions</a></label>
                        </div>
                        {acceptShow1}
                    </form>;
        if(this.state.change1 && !this.state.change2)
        {
            account =<form autoComplete='off' className="col-12 border-bottom border-right border-left border-warning" onSubmit={this.handleFormSubmit1}>
                <div className="col-12" onFocus={this.showPlacholder} onBlur={this.hidPlacholder}>
                    <div className="row">
                        <label className="disable" htmlFor="public_key">Public key</label>
                        <input data-input="Public key : GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO" autoComplete="off" className="col-12 mt-4 p-2 rounded shadow-lg" placeholder="Public key : GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO" name="public_key" required="required" type="text" onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="col-12" onFocus={this.showPlacholder} onBlur={this.hidPlacholder}>
                    <div className="row">
                        <label className="disable" htmlFor="secret_key">Secret key</label>
                        <input data-input="Secret key : SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" autoComplete="off" className="col-12 mt-3 p-2 rounded shadow-lg" placeholder="Secret key : SB3JKIKJ7ECA2GBB55KG55KRHUILGDHXZ5GZ5WBWYOFS7KU6JT73C7HX" name="secret_key" required="required" type="text" onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="p-2 mt-3 col-12">
                    <input type="checkbox" id="Choice3" name="accept" value="accept" onChange={this.acceptTerm}/>
                    <label className="col-5 text-light" htmlFor="Choice3"><a href="#" className="text-light">Accept term and conditions</a></label>
                </div>
                {acceptShow1}
            </form>;
        }
        if(!this.state.change1 && this.state.change2)
        {
            account = <form autoComplete='off' className="col-12 border-bottom border-right border-left border-warning" onSubmit={this.handleFormSubmit2}>
                <input className="col-12 mt-4 p-2 bg-warning rounded shadow-lg text-center" onClick={this.handleGenerate} value="GENERATE kEYPAIR"/>
                <div className="col-12" onFocus={this.showPlacholder} onBlur={this.hidPlacholder}>
                    <div className="row">
                        <label className="disable" htmlFor="generate_public_key">Generate Public key</label>
                        <input data-input="Generate Public key" autoComplete="off" className="col-12 mt-3 p-2 rounded shadow-lg" placeholder="Generate Public key" name="generate_public_key" value={this.state.newKeypair.pubKey}/>
                    </div>
                </div>
                <div className="col-12" onFocus={this.showPlacholder} onBlur={this.hidPlacholder}>
                    <div className="row">
                        <label className="disable" htmlFor="generate_secret_key">Generate Secret key</label>
                        <input data-input="Generate Secret key" autoComplete="off" className="col-12 mt-3 p-2 rounded shadow-lg" placeholder="Generate Secret key" name="generate_secret_key" value={this.state.newKeypair.secretKey}/>
                    </div>
                </div>
                <div className="p-2 mt-3 col-12">
                    <input type="checkbox" id="Choice4" name="accept" value="accept" onChange={this.acceptTerm2}/>
                    <label className=" text-light" htmlFor="Choice4"><div href="#" className="text-light col-12">I have written done my public key and secret key</div></label>
                </div>
                <div className="p-2 col-12">
                    <input type="checkbox" id="Choice3" name="accept" value="accept" onChange={this.acceptTerm3}/>
                    <label className=" text-light" htmlFor="Choice3"><a href="#" className="text-light col-12">Accept term and conditions</a></label>
                </div>
                {acceptShow2}
            </form>;
        }
        return (
            <div className="col-sm-6 col-12 clearfix mx-auto">
                <div className="row">
                    {valid}
                    {/*{invalid}*/}
                    <h2 className="col-12 text-light text-center font-weight-bold mb-5">Stellar account</h2>
                    <div className="col-12">
                        <div className="row">
                            <a id='add' onClick={this.changeForm1} className="col-6 text-light text-center font-weight-bold rounded-top border-top border-right border-left border-warning pt-3 pb-3">I Already Have An Account</a>
                            <a id='create' onClick={this.changeForm2} className="col-6 text-light text-center font-weight-bold border-bottom border-warning pt-3 pb-3 hover-tab rounded-top">Create a new account</a>
                        </div>
                    </div>
                    {account}
                </div>
            </div>
        );
    }
}

export default Account;
