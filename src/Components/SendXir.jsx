import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import {faEye} from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';
import NumberFormat from 'react-number-format';
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

class SendXir extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.showPass = this.showPass.bind(this);
        this.hidePass = this.hidePass.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClickButton = this.handleClickButton.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // this.return = this.return.bind(this);
        this.state = {
            price: null,
            public_key: null,
            secret_key: '',
            data: '',
            sam: '',
            hash: false,
            load: false,
            inValidSecretKey: false,
            inValidPublicKey: false,
            button: false,
            key: 0,
            userAmount: false,
        }
    }

    // return(e)
    // {
    //     e.preventDefault();
    //     window.location.replace('/Components/SendXir');
    // }

    handleOpen(e)
    {
        e.preventDefault();
        document.getElementById('modal').style.display = "block";
    }

    handleClose(e)
    {
        e.preventDefault();
        document.getElementById('modal').style.display = "none";
    }

    showPass(e){
        e.preventDefault();
        document.getElementById('showOrHidden').setAttribute("type", "text");
    }

    hidePass(e)
    {
        e.preventDefault();
        document.getElementById('showOrHidden').setAttribute("type", "password");
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleClickButton(e)
    {
        e.preventDefault();
        if(!isValidPublicKey(this.state.public_key_dest))
        {
            this.setState({
                inValidPublicKey: true,
            });
            return true;
        }
        if(parseFloat(this.state.amount.replace(/,/g, '')) >= 10000 && parseFloat(this.state.amount.replace(/,/g, '')) <= this.state.xirBalance) {
            this.setState({
                button: true,
            });
        }
        else
        {
            this.setState({
                userAmount: true
            })
        }
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount() {
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
                    this.assetAmount(this.state.public_key);
                });
    }

    assetAmount(public_key) {
        const url = 'https://horizon-testnet.stellar.org/accounts/' + public_key;
        return axios.get(url)
            .then(res =>{
                this.setState({
                    entry: res.data.subentry_count,
                });
                res.data.balances.map(elem => {
                    if(elem.asset_code === "XIR")
                    {
                        this.setState({
                            xirBalance: elem.balance
                        });
                    }
                    if(elem.asset_type === "native")
                    {
                        this.setState({
                            xlmBalance: elem.balance
                        });
                    }
                    return true;
                });
            });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        if(!isValidSecretKey(this.state.secret_key_source))
        {
            this.setState({
                inValidSecretKey: true,
                failed: '',
            });
            return true;
        }
        this.setState({
            load: !this.state.load,
        });
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        StellarSdk.Network.useTestNetwork();
        var keypair = StellarSdk.Keypair.fromSecret(this.state.secret_key_source);
        var destination = this.state.public_key_dest;
        var amount = this.state.amount.replace(/,/g, '');
        var issuingKeys = StellarSdk.Keypair.fromSecret('SCWZO5OVQLGZ36BNDCDTQOZAYAXVDCHUKS6SFPQSPCPNDLLB6S6IU2NK');
        var XIR = new StellarSdk.Asset('XIR', issuingKeys.publicKey());
        server.loadAccount(keypair.publicKey())
            .then(result => {
            var transaction = new StellarSdk.TransactionBuilder(result)
                .addOperation(StellarSdk.Operation.payment({
                    destination,
                    amount,
                    asset: XIR
                }))
                .setTimeout(180)
                .build();
             transaction.sign(keypair);
             server.submitTransaction(transaction)
                 .then( res => {
                    this.setState({
                        hash: res.hash,
                    });
                })
                 .catch(err =>{
                     let datas = err.response;
                     this.setState({
                         load: false,
                         failed: datas.data.extras.result_codes.operations[0]
                     });
                 })
        });

    }

    render() {
        let priceXlm = '';
        if(this.state.xirBalance)
        {
            priceXlm = parseInt(this.state.xirBalance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' XIR';
        }
        let failAmount= '';
        if(this.state.userAmount === true)
        {
            failAmount = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    The XIR amount must be between 10,000 and {priceXlm}
                </div>
            </div>;
        }
        let failTransaction = "";
        if(this.state.failed === 'op_underfunded')
        {
            this.state.load2 = false;
            this.state.inValidPublicKey = false;
            this.state.inValidSecretKey = false;
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your account doesn't have enough XIR to send
                </div>
            </div>;
        }
        else if(this.state.failed === 'op_no_trust')
        {
            this.state.load2 = false;
            this.state.inValidPublicKey = false;
            this.state.inValidSecretKey = false;
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Receiver account doesn't have trust to XIR
                </div>
            </div>;
        }
        else if(this.state.failed === 'op_src_no_trust')
        {
            this.state.load2 = false;
            this.state.inValidPublicKey = false;
            this.state.inValidSecretKey = false;
            failTransaction = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your account doesn't Have trust to XIR
                </div>
            </div>;
        }
        let valid = "";
        let valids ="";
        if(this.state.inValidSecretKey === true)
        {
            valid = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your secret key invalid
                </div>
            </div>;
        }

        if(this.state.inValidPublicKey === true)
        {
            valids = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your public key invalid
                </div>
            </div>;
        }
        let loader = "";
        if(this.state.load === false)
        {
            loader = <div className="col-12 text-right pr-0 pl-0">
                <button className="col-sm-2 col-12 bg-warning rounded shadow-lg text-light mb-3 mt-2 small font-weight-bold pt-1 pb-1">SUBMIT</button>
            </div>;
        }
        else if(this.state.load === true)
        {
            loader = <div className="col-12 text-right pr-0 pl-0">
                <button className="col-sm-2 col-12 bg-warning rounded shadow-lg mb-3 mt-2 text-light pt-1 pb-1">
                    <Loader
                        type="ThreeDots"
                        color="#fff"
                        height="20"
                        width="40"
                    />
                </button>
            </div>;
        }
        if(!this.state.hash && !this.state.button) {
            return (
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 alireza">
                            <div className="col-sm-8 col-12 clearfix mx-auto mt-3 mb-5">
                                <div className="row">
                                    {valids}
                                    {failAmount}
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Create</div>
                                                <div className="bg-warning mx-auto box-height box-height1 box-height-color mt-2">1</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Approve</div>
                                                <div className="bg-light mx-auto box-height box-height2 mt-2">2</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Result</div>
                                                <div className="bg-light mx-auto box-height box-height3 mt-2">3</div>
                                            </div>
                                            <div className="col-sm-9 col-12 bg-light mx-auto rounded shadow-lg box-triangle1 mt-3 small">
                                                <div className="col-12 mt-2 text-center">To send XIR to another account,</div>
                                                <div className="col-12 mt-2 text-center">enter the amount of XIR you are going to send and the destination public-key.</div>
                                                <div className="col-12 mt-2 mb-2 text-center">Notice! The destination account must have XIR trustline.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="col-sm-8 col-12 clearfix mx-auto border border-warning mt-3 mb-3 rounded shadow-lg">
                                <div className="row">
                                    <div className="col-12 border-bottom border-warning">
                                        <div className="row mt-2 mb-2">
                                            <div className="col-sm-1 d-none d-sm-block icon9"> </div>
                                            <div className="col-sm-11 pl-0 d-none d-sm-block small font-weight-bold">Send XIR</div>
                                            <div className="col-12 d-sm-none d-bolck small font-weight-bold">Send XIR</div>
                                        </div>
                                    </div>
                                    <form className="col-12" onSubmit={this.handleClickButton}>
                                        <div className='col-12 small font-weight-bold text-center mt-3'>Available : {priceXlm}</div>
                                        <label className="col-12 mt-3">
                                            <div className="row">
                                                <span className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Amount XIR (Exir) :</span>
                                                {/*<input className="col-9 text-center rounded-right p-2" placeholder="" name="amount" type="tel" onChange={this.handleChange}/>*/}
                                                <NumberFormat required='required' className="input2 col-sm-9 col-12 text-center pt-1 pb-1 rounded" thousandSeparator={true} name="amount" onChange={this.handleChange} />
                                            </div>
                                        </label>
                                        <label className="col-12 mt-2">
                                            <div className="row">
                                                <span className="col-sm-3 col-12 small font-weight-bold pt-1 pb-1">Destination public_key :</span>
                                                <input required='required' className="input2 col-sm-9 col-12 text-center pt-1 pb-1 rounded" placeholder="GDNRPMNBJYNFDVTOBBPGWQBJORVPYVI2YP4G2MG6DNRXGJKQA5TG2PRO" name="public_key_dest" type="text" onChange={this.handleChange}/>
                                            </div>
                                        </label>
                                        {loader}
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/*<a className="exclamation-icon" onClick={this.handleOpen}>*/}
                            {/*<FontAwesomeIcon className="" icon={faExclamationCircle}/>*/}
                        {/*</a>*/}
                        {/*<div id="modal" className="exclamation-text rounded">*/}
                            {/*<div className="exclamation-text-in rounded shadow-lg small">*/}
                                {/*<a className="col-12 exclamation-text-icon text-danger mt-1" onClick={this.handleClose}>*/}
                                    {/*<FontAwesomeIcon className="" icon={faTimes}/>*/}
                                {/*</a>*/}
                                {/*<div className="col-12 font-weight-bold mt-2">In order to you send your money to another account you must do the following :</div>*/}
                                {/*<div className="col-12 mt-2">1- Enter your amount then enter the desired destination public key.</div>*/}
                                {/*<div className="col-12 mt-2">2- Click on submit button.</div>*/}
                                {/*<div className="col-12 mt-2">3- Enter your secret key.</div>*/}
                                {/*<div className="col-12 mt-2">4- Click on submit button.</div>*/}
                                {/*<div className="col-12 mt-2">5- If everything goes well the Transaction will be successful.</div>*/}
                                {/*<div className="col-12 font-weight-bold mt-2">Notice a few notes before sending :</div>*/}
                                {/*<div className="col-12 mt-2">1- Required amount for transaction must be available balance.</div>*/}
                                {/*<div className="col-12 mt-2">2- Minimum amount of money for send 1 XIR and maximum is equal to your available balance.</div>*/}
                                {/*<div className="col-12 mt-2 mb-4">3- The reciver must have XIR trust.</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            );
        }
        else if(!this.state.hash && this.state.button)
        {
            return (
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 alireza">
                            <div className="col-sm-8 col-12 clearfix mx-auto mt-3 mb-5">
                                <div className="row">
                                    {failTransaction}
                                    {valid}
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Create</div>
                                                <div className="bg-warning mx-auto box-height box-height1 box-height-color mt-2">1</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Approve</div>
                                                <div className="bg-warning mx-auto box-height box-height2 box-height-color mt-2">2</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Result</div>
                                                <div className="bg-light mx-auto box-height box-height3 mt-2">3</div>
                                            </div>
                                            <div className="col-sm-9 col-12 bg-light mx-auto rounded shadow-lg box-triangle2 mt-3 small">
                                                <div className="col-12 mt-2 text-center">You are sending <span className="font-weight-bold">{this.state.amount}</span> XIR to the following address :</div>
                                                <div className="col-12 mt-2 font-weight-bold text-center word-wrap">{this.state.public_key_dest}</div>
                                                <div className="col-12 mt-2 mb-2 text-center">Please enter your secret key to approve the transaction.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="col-sm-8 col-12 clearfix mx-auto border border-warning mt-3 mb-3 rounded shadow-lg">
                                <div className="row">
                                    <div className="col-12 border-bottom border-warning">
                                        <div className="row mt-2 mb-2">
                                            <div className="col-sm-1 d-none d-sm-block icon9"> </div>
                                            <div className="col-sm-11 d-none d-sm-block pl-0 small font-weight-bold">Send XIR</div>
                                            <div className="col-12 d-sm-none d-block d-none d-sm-block small font-weight-bold">Send XIR</div>
                                        </div>
                                    </div>
                                    {/*<a className="col-12" onClick={this.return}>*/}
                                    {/*<div className="col-3 bg-warning text-center rounded shadow-lg text-light pt-2 pb-2">*/}
                                    {/*RETURN*/}
                                    {/*</div>*/}
                                    {/*</a>*/}
                                    <form className="col-12" onSubmit={this.handleFormSubmit}>
                                        <label className="col-12 mt-3">
                                            <div className="row">
                                                <span className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Source secret key :</span>
                                                <input required='required' id='showOrHidden' className="input2 col-sm-8 col-10 text-center pt-1 pb-1 rounded-left" placeholder="SBFHY64P7A4UUONPZJFBUUCI76PCKJXYMA5AESBC4LAETUUOAS55GBI2" name="secret_key_source" type="password" onChange={this.handleChange}/>
                                                <a className='col-sm-1 col-2 text-center bg-warning rounded-right text-light pt-1 pb-1' onMouseDown={this.showPass} onMouseUp={this.hidePass}><FontAwesomeIcon className="col-12 pr-0 pl-0" icon={faEye}/></a>
                                            </div>
                                        </label>
                                        {loader}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if(this.state.hash && this.state.button)
        {
            return(
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 alireza">
                            <div className="col-sm-8 col-12 clearfix mx-auto mt-3 mb-5">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Create</div>
                                                <div className="bg-warning mx-auto box-height box-height1 box-height-color mt-2">1</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Approve</div>
                                                <div className="bg-warning mx-auto box-height box-height2 box-height-color mt-2">2</div>
                                            </div>
                                            <div className="col-4 text-center">
                                                <div className="col-12 text-center text-light font-weight-bold small">Result</div>
                                                <div className="bg-warning mx-auto box-height box-height3 box-height-color mt-2">3</div>
                                            </div>
                                            <div className="col-sm-9 col-12 bg-light mx-auto rounded shadow-lg box-triangle3 mt-3 small">
                                                <div className="col-12 font-weight-bold mt-2 mb-2 text-center">Your transaction has been done successfully.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="col-sm-8 col-12 clearfix mx-auto border border-warning mt-3 mb-3 rounded shadow-lg">
                                <div className="row">
                                    <div className="col-12 border-bottom border-warning">
                                        <div className="row mt-2 mb-2">
                                            <div className="col-sm-1 d-none d-sm-block icon9"> </div>
                                            <div className="col-sm-11 d-none d-sm-block pl-0 small font-weight-bold">Send XIR</div>
                                            <div className="col-12 d-block d-sm-none small font-weight-bold">Send XIR</div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <div className="row">
                                            <div className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Your transaction hash :</div>
                                            <a className="col-sm-9 col-12 pt-1 pb-1 word-wrap" target='_blank' href={'https://horizon-testnet.stellar.org/transactions/' + this.state.hash}>{this.state.hash}</a>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3 mb-3 text-right">
                                        <a href="../Components/Dashboard" className='col-sm-2 col-12 text-center text-light pt-2 pb-2 bg-warning rounded ml-auto small font-weight-bold'>Back to dashboard</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default SendXir;