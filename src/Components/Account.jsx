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
        this.showTerm = this.showTerm.bind(this);
        this.hideTerm = this.hideTerm.bind(this);
        this.showIran = this.showIran.bind(this);
        this.showBritain = this.showBritain.bind(this);
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

    showTerm(e)
    {
        e.preventDefault();
        document.getElementById('term-condition').style.display = "block";
    }

    hideTerm(e)
    {
        e.preventDefault();
        document.getElementById('term-condition').style.display = "none";
    }

    showIran(e)
    {
        e.preventDefault();
        document.getElementById('iran').style.display = "block";
        document.getElementById('britain').style.display = "none";
    }

    showBritain(e)
    {
        e.preventDefault();
        document.getElementById('britain').style.display = "block";
        document.getElementById('iran').style.display = "none";
    }

    // componentWillMount() {
    //     if (!this.Auth.loggedIn()) {
    //         window.location.replace('/Components/Login');
    //     }
    //     const urlPublic = this.Auth.getDomain() + '/user/account';
    //     const headersPublic = {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${this.Auth.getToken()}`,
    //     };
    //     var configPublic = { headers: headersPublic };
    //     return axios.get(urlPublic, configPublic)
    //         .then(response => {
    //             this.setState({
    //                 public_key: response.data[0].public_key
    //             });
    //             if (this.state.public_key)
    //             {
    //                 window.location.replace('/Components/Dashboard');
    //             }
    //         });
    // }

    changeForm1(e)
    {
        e.preventDefault();
        this.setState({
            change1: true,
            change2: false
        });
        e.currentTarget.setAttribute("class", "col-6 text-light text-center font-weight-bold pt-2 pb-2 bg-warning");
        document.getElementById('create').setAttribute("class","col-6 text-light text-center font-weight-bold pt-2 pb-2 hover-tab");
    }

    changeForm2(e)
    {
        e.preventDefault();
        this.setState({
            change2: true,
            change1: false
        });
        e.currentTarget.setAttribute("class", "col-6 text-light text-center font-weight-bold pt-2 pb-2 bg-warning");
        document.getElementById('add').setAttribute("class","col-6 text-light text-center font-weight-bold pt-2 pb-2 hover-tab");
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
        StellarSdk.Network.usePublicNetwork();
        var server = new StellarSdk.Server('https://horizon.stellar.org');
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
        let account = <form autoComplete='off' className="col-12 border border-warning rounded shadow-lg" onSubmit={this.handleFormSubmit1}>
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
                            <label className="col-5 text-light generate" htmlFor="Choice3"><a onClick={this.showTerm} className="text-light">Accept term and conditions</a></label>
                        </div>
                        {acceptShow1}
                    </form>;
        if(this.state.change1 && !this.state.change2)
        {
            account =<form autoComplete='off' className="col-12 border border-warning rounded shadow-lg" onSubmit={this.handleFormSubmit1}>
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
                    <label className="col-5 text-light generate" htmlFor="Choice3"><a onClick={this.showTerm} className="text-light">Accept term and conditions</a></label>
                </div>
                {acceptShow1}
            </form>;
        }
        if(!this.state.change1 && this.state.change2)
        {
            account = <form autoComplete='off' className="col-12 border border-warning rounded shadow-lg" onSubmit={this.handleFormSubmit2}>
                <div className="generate col-12 mt-4 p-2 bg-warning rounded shadow-lg text-center text-white" onClick={this.handleGenerate}>GENERATE kEYPAIR</div>
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
                    <label className="text-light" htmlFor="Choice4"><div href="#" className="text-light col-12">I have written done my public key and secret key</div></label>
                </div>
                <div className="p-2 col-12">
                    <input type="checkbox" id="Choice3" name="accept" value="accept" onChange={this.acceptTerm3}/>
                    <label className="generate text-light" htmlFor="Choice3"><a onClick={this.showTerm} className="text-light col-12">Accept term and conditions</a></label>
                </div>
                {acceptShow2}
            </form>;
        }
        return (
            <div className="col-12">
                <div className="row">
                    <div className="col-sm-6 col-12 clearfix mx-auto">
                        <div className="row">
                            {valid}
                            {/*{invalid}*/}
                            <h4 className="col-12 text-light text-center mt-5 mb-5">Stellar account</h4>
                            <div className="col-12 border border-warning rounded shadow-lg mb-2">
                                <div className="row">
                                    <a id='add' onClick={this.changeForm1} className="col-6 text-light text-center font-weight-bold pb-2 pt-2 bg-warning">I Already Have An Account</a>
                                    <a id='create' onClick={this.changeForm2} className="col-6 text-light text-center font-weight-bold pt-2 pb-2 hover-tab">Create a new account</a>
                                </div>
                            </div>
                            {account}
                        </div>
                    </div>
                    <div id="term-condition" className="term-condition">
                        <div className="col-12 col-sm-8 mx-auto bg-white rounded shadow-lg mt-5 height-term">
                            <div className="row text-justify">
                                <div className="col-12 pt-2 pb-2 border-bottom border-stupid">
                                    <div className="row">
                                        <div className="col-2">
                                            <div className="row">
                                                <a onClick={this.showIran} className="col-6 iran-img"> </a>
                                                <a onClick={this.showBritain} className="col-6 britain-img"> </a>
                                            </div>
                                        </div>
                                        <h5 className="col-8 text-center">Term and conditions</h5>
                                        <div className="col-2"> </div>
                                    </div>
                                </div>
                                <div id="britain" className="col-12 small">
                                    <div className="row">
                                        <div className="col-12">
                                            This agreement is between you (referenced herein as “you” or with “your”) and exireum. By accessing, using or clicking “I agree” to any of the services made available by Exireum or one of its affiliates through the website (https://exireum.com), or any other related services provided by exireum or its affiliates as further described in Section 4 below (collectively, the “Services”) you agree that you have read, understood and accepted all of the terms and conditions contained in this terms of use agreement (the or these “terms”), as well as our Privacy Policy found at (https:// exireum.com). Additionally, when using certain features of the Services, you may be subject to additional terms and conditions applicable to such features.
                                        </div>
                                        <div className="col-12 mt-2">
                                            Please read these terms carrefully as they govern your use of the services. These terms contains important provisions includding an arbiration provision that requires all claims to be resolved by way of binding arbiration. The terms of the arbiration provision are set forth in section 14 below entitled “resolving disputes : forum, arbiration, class action waiver, governing law”. As with any asset, the value of digital currencies can go up or down and there can be a substantal risk that you will lose money buying, selling, holding or investing in digital currencies. By using the services you acknowledge and agree that (1) you are aware of the risk associated whith transacting in digital currencies (2) that you assume all risks whith respect to your use of the services and trading in digital currencies and (3) exireum is not responsible or liable for any such risks or adverse outcomes.
                                        </div>
                                        <div className="col-12 mt-2">
                                            By accessing, using or attempting to use the services in any capacity, you acknowledge that you accept and agree to be bound by these terms. If you do not agree, do not access or use the services.
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            1. Agreement Conditions
                                        </div>
                                        <div className="col-12">
                                            Exireum reserves the right to modify or change the terms at any time and at its sole discretion. Exireum will provide notice of these changes by updating the revised terms on the webpage (https:// exireum.com/Components/Ticket) and changing the “[Last revised: ]” date on this page. Any and all modifications or changes to these Terms will be effective immediately upon being announced on the website or released to users. As such, your continued use of exireum’s services acts as acceptance of the amended agreement and rules. If you do not agree to any modification to these terms, you must stop using the services. Exireum encourages you to frequently review the terms to ensure you understand the terms and conditions that apply to your access to, and use of, the services.
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            2. Eligibility
                                        </div>
                                        <div className="col-12">
                                            By registering to use a exireum account (as defined in Section 5 below), you represent and warrant that you (a) are at least 18 years old or of legal age to form a binding contract under applicable law, (b) are an individual, legal person or other organization with full legal capacity and authority to enter into these Terms, (c) have not previously been suspended or removed from using our Services and (d) you do not currently have an existing exireum account. If you are entering into these Terms on behalf of a legal entity of which you are an employee or agent, you represent and warrant that you have all necessary rights and authority to bind such legal entity.
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            3. Prohibition of use
                                        </div>
                                        <div className="col-12">
                                            By accessing and using the services, you represent and warrant that you are not on any trade or economic sanctions lists, such as the UN Security Council Sanctions listExireum maintains the right to select its markets and jurisdictions to operate and may restrict or deny the services in certain countries at its discretion.
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            4. Description of services
                                        </div>
                                        <div className="col-12">
                                            Exireum strives to maintain the accuracy of information posted on the services however it cannot and does not guarantee the accuracy, suitability, reliability, completeness, performance or fitness for any purpose of the content made available through the Services, and will not be liable for any loss or damage that may arise directly or indirectly from your use of such content. Information on the Services can be subjected to change without notice and is provided for the primary purpose of facilitating users to arrive at independent decisions. Exireum does not provide investment or advisory advice and will have no liability for the use or interpretation of information as stated on the Services or other communication mediums. All users of the services must understand that there are risks involved in trading in Digital Currencies. Exireum encourages all users to exercise prudence and trade responsibly within their own means.
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            5. Exireum account registration & requirements
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            a. Registration
                                        </div>
                                        <div className="col-12">
                                            All users of the services (each, a “User”) must register at (https:// exireum.com/Components/Register) for a Exireum account (an “account”) before using the services. To register for an Account, you must provide your user name, email, full name, national id, address, mobile and password, as well as accept the terms of use, privacy policy and Consent Form. Exireum may, in its sole discretion, refuse to open an account for you. You agree to provide complete and accurate information when opening an account and agree to promptly update any information you provide to exireum so that such information is complete and accurate at all times. Each registration is for a single user only and each User (including with respect to any User that is a business or legal entity) may only maintain one active account with exireum.
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            b. User identity verification
                                        </div>
                                        <div className="col-12">
                                            With registration of an account on exireum, you agree to share personal information requested for the purposes of identity verification. This information is used specifically for the detection of money laundering, terrorist financing, fraud and other financial crimes on the exireum platform. We will collect, use and share this information in accordance with our posted privacy policy. In addition to providing this information, to facilitate compliance with global industry standards for data retention, you agree to permit us to keep a record of such information for the lifetime of your account plus 5 years beyond account closing. You also authorise us to make inquiries, either directly or through third parties, that are deemed necessary to verify your identity or to protect you and/or us against financial crimes such as fraud. The identity verification information we request may include, but is not limited to, your: Name, Email Address, Contact Information, Telephone Number, Username, Date of Birth and other information collected at the time of account registration. In providing this required information, you confirm that it is accurate and authentic. Post-registration, you must guarantee that the information is truthful, complete and updated in a timely manner with any changes. If there is any reasonable doubt that any information provided by you is wrong, untruthful, outdated or incomplete, Exireum shall have the right to send you a notice to demand corrections, remove relevant information directly. By signing up for account you hereby authorize exireum to make inquiries, whether directly or through third parties, that exireum considers necessary to verify your identity or protect you and / or exireum against fraud or other financial crimes, and to take action exireum reasonably deems necessary based on the results of such inquiries. You also acknowledge and agree that your personal information may be disclosed to credit reference and fraud prevention or financial crime agencies and that these agencies may respond to our inquiries in full.
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            c. Account usage requirements
                                        </div>
                                        <div className="col-12">
                                            Accounts can only be used by the person whose name they are registered under. Exireum reserves the right to suspend, freeze or cancel accounts that are used by persons other than the persons whose names they are registered under. You shall immediately notify exireum if you suspect or become aware of unauthorized use of your user name and password. Exireum will not be liable for any loss or damage arising from any use of your Account by you or by any third party (whether or not authorized by you).
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            d. Account Security
                                        </div>
                                        <div className="col-12">
                                            Exireum strives to maintain the safety of those user funds entrusted to us and has implemented industry standard protections for the Services. However, there are risks that are created by individual User actions. You agree to consider your access credentials such as user name and password as confidential information and not to disclose such information to any third party. You also agree that you alone are responsible for taking necessary safety precautions to protect your own account and personal information. You shall be solely responsible for the safekeeping of your exireum account and password on your own, and you shall be responsible for all activities under account and exireum will not be responsible for any loss or consequences of authorized or unauthorized use of your account credentials including but not limited to information disclosure, information posting, consent to or submission of various rules and agreements by clicking on the website, online renewal of agreement, etc. By creating an account, you hereby agree that: (i) you will notify exireum immediately if you are aware of any unauthorized use of your exireum account and password by any person or any other violations to the security rules; (ii) you will strictly observe the security, authentication, dealing, charging, withdrawal mechanism or procedures of the website/service; and (iii) you will log out from the website by taking proper steps at the end of every visit.
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            6. Guidelines for Usage of the Services
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            a. License
                                        </div>
                                        <div className="col-12">
                                            Subject to your continued compliance with the express terms and conditions of these Terms, exireum provides to you a revocable, limited, royalty-free, non-exclusive, non-transferable, and non-sublicensable license to access and use the services on your computer or other internet compatible device for your personal, internal use only. You are not permitted to use the services for any resale or commercial use including to place trades on behalf of another person or entity. All such use is expressly prohibited and shall constitute a material violation of these terms. The content layout, formatting, and features of and access privileges for the services shall be as specified by exireum in its sole discretion. All rights not expressly granted under these terms are hereby reserved. Accordingly, you are hereby prohibited from using the services in any manner that is not expressly and unambiguously authorized by these terms. These terms provide only a limited license to access and use the Services. Accordingly, you hereby agree that exireum transfers no ownership or intellectual property interest or title in and to the services or any exireum intellectual property to you or anyone else in connection with your use of the services. All text, graphics, user interfaces, visual interfaces, photographs, sounds, artwork, computer code (including html code), programs, software, products, information, and documentation as well as the design, structure, selection, coordination, expression, “look and feel,” and arrangement of any content contained on or available through the Services are exclusively owned, controlled, and/or licensed by exireum or its members, parent(s), licensors, or affiliates. Exireum will own any feedback, suggestions, ideas, or other information or materials regarding exireum or the services that you provide, whether by email, through the services or otherwise (“Feedback”). You hereby assign to exireum all right, title and interest to Feedback together with all associated intellectual property rights. You will not be entitled to, and hereby waive any claim for, acknowledgment or compensation based on any feedback or any modifications made based on any Feedback.
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            b. Restrictions
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            7. Orders and Service Fees
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            a. Orders
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            b. Cancellations
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            c. Fees
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            8. Liability
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            a. Disclaimer of Warranties
                                        </div>
                                        <div className="col-12">
                                            To the maximum extent permitted under applicable law, the services, the exireum materials and any product, service or other item provided by or on behalf of exireum are provided on an “as is” and “as available” basis and exireum expressly disclaims, and you waive, any and all other warranties of any kind, whether express or implied, including, without limitation, implied warranties of merchantability, fitness for a particular purpose, title or non-infringement or warranties arising from course of performance, course of dealing or usage in trade. Without limiting the foregoing, exireum does not represent or warrant that the site, the services or exireum materials are accurate, complete, reliable, current, error-free, or free of viruses or other harmful components. Exireum does not guarantee that any order will be executed, accepted, recorded or remain open. Except for the express statements set forth in this agreement, you hereby acknowledge and agree that you have not relied upon any other statement or understanding, whether written or oral, with respect to your use and access of the services. Without limiting the foregoing, you hereby understand and agree that exireum will not be liable for any losses or damages arising out of or relating to: (a) any inaccuracy, defect or omission of digital currency price data, (b) any error or delay in the transmission of such data, (c) interruption in any such data and (d) any damages incurred by another user’s actions, omissions or violation of this agreement. The disclaimer of implied warranties contained herein may not apply if and to the extent it is prohibited by applicable law of the jurisdiction in which you reside.
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            b. Disclaimer of damages and limitation of liability
                                        </div>
                                        <div className="col-12">
                                            To the maximum extent permitted by applicable law, in no event will exireum, its affiliates and their respective shareholders, members, directors, officers, employees, attorneys, agents, representatives, suppliers or contractors be liable for any incidental, indirect, special, punitive, consequential or similar damages or liabilities whatsoever (including, without limitation, damages for loss of data, information, revenue, profits or other business or financial benefit) arising out of or in connection with the services, any performance or non-performance of the services, or any other product, service or other item provided by or on behalf of exireum and its affiliates, whether under contract, statute, strict liability or other theory even if exireum has been advised of the possibility of such damages except to the extent of a final judicial determination that such damages were a result of exireum’s gross negligence, fraud, willful misconduct or intentional violation of law. Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitation may not apply to you. Notwithstanding the foregoing, in no event will the liability of exireum, its affiliates and their respective shareholders, members, directors, officers, employees, attorneys, agents, representatives, suppliers or contractors arising out of or in connection the services, any performance or non-performance of the services, or any other product, service or other item provided by or on behalf of exireum or its affiliates whether under contract, statute, strict liability or other theory, exceed the amount of the fees paid by you to exireum under this agreement in the twelve-month period immediately preceding the event giving rise to the claim for liability.
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            c. Indemnification
                                        </div>
                                        <div className="col-12">
                                            You agree to indemnify and hold harmless Exireum, its affiliates, contractors, licensors, and their respective directors, officers, employees and agents from and against any claims, actions, proceedings, investigations, demands, suits, costs, expenses and damages (including attorneys’ fees, fines or penalties imposed by any regulatory authority) arising out of or related to (i) your use of, or conduct in connection with, the Services, (ii) your breach or our enforcement of these Terms, or (iii) your violation of any applicable law, regulation, or rights of any third party during your use of the Service. If you are obligated to indemnify exireum, its affiliates, contractors, licensors, and their respective directors, officers, employees or agents pursuant to this clause, exireum will have the right, in its sole discretion, to control any action or proceeding and to determine whether exireum wishes to settle, and if so, on what terms.
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            9. Termination of Agreement
                                        </div>
                                        <div className="col-12">
                                            You agree that exireum shall have the right to immediately suspend your account (and any accounts beneficially owned by related entities or affiliates), freeze or lock the funds in all such accounts, and suspend your access to exireum for any reason including if it suspects any such accounts to be in violation of these terms, our privacy policy, or any applicable laws and regulations. You agree that exireum shall not be liable to you for any permanent or temporary modification, suspension or termination of your account or access to all or any portion of the Services. exireum shall have the right to keep and use the transaction data or other information related to such accounts. The above account controls may also be applied in the following cases:
                                        </div>
                                        <div className="col-12">
                                            •	The account is subject to a governmental proceeding, criminal investigation or other pending litigation.
                                        </div>
                                        <div className="col-12">
                                            •	We detect unusual activity in the account.
                                        </div>
                                        <div className="col-12">
                                            •	We detect unauthorized access to the account.
                                        </div>
                                        <div className="col-12">
                                            •	We are required to do so by a court order or command by a regulatory / government authority.
                                        </div>
                                        <div className="col-12">
                                            In case of any of the following events, exireum shall have the right to directly terminate this agreement by cancelling your account, and shall have the right to permanently freeze (cancel) the authorizations of your account on exireum and withdraw the corresponding exireum account thereof:
                                        </div>
                                        <div className="col-12">
                                            •	after exireum terminates services to you.
                                        </div>
                                        <div className="col-12">
                                            •	you allegedly register or register in any other person’s name as exireum user again, directly or indirectly.
                                        </div>
                                        <div className="col-12">
                                            •	the information that you have provided is untruthful, inaccurate, outdated or incomplete.
                                        </div>
                                        <div className="col-12">
                                            •	when these Terms are amended, you expressly state and notify exireum of your unwillingness to accept the amended terms.
                                        </div>
                                        <div className="col-12">
                                            •	you request that the services be terminated.
                                        </div>
                                        <div className="col-12">
                                            •	any other circumstances where exireum deems it should terminate the services.
                                        </div>
                                        <div className="col-12">
                                            Should your account be terminated, the account and transactional information required for meeting data retention standards will be securely stored for 5 years. In addition, if a transaction is unfinished during the Account termination process, exireum shall have the right to notify your counterparty of the situation at that time. You acknowledge that a user initiated account exit (right to erasure under GDPR or other equivalent regulations) will also be subjected to the termination protocol stated above. If exireum receives notice that any funds held in your account are alleged to have been stolen or otherwise are not lawfully possessed by you, exireum may, but has no obligation to, place an administrative hold on the affected funds and your account. If exireum does place an administrative hold on some or all of your funds or account, exireum may continue such hold until such time as the dispute has been resolved and evidence of the resolution acceptable to exireum has been provided to exireum in a form acceptable to exireum. exireum will not involve itself in any such dispute or the resolution of the dispute. You agree that exireum will have no liability or responsibility for any such hold, or for your inability to withdraw funds or execute trades during the period of any such hold.
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            a. Remaining funds after Account termination
                                        </div>
                                        <div className="col-12">
                                            Except as set forth in subsection (b) below, once the account is closed/withdrawn, all remaining balance (which includes charges and liabilities owed to exireum) on the account will be payable immediately to Exireum. Upon payment of all outstanding charges to exireum (if any), the User will have 5 business days to withdraw all funds from the account.
                                        </div>
                                        <div className="col-12 font-weight-bold">
                                            b. Remaining funds after account termination due to fraud, violation of law, or violation of these terms)
                                        </div>
                                        <div className="col-12">
                                            Exireum maintains full custody of the funds and user data / information which may be turned over to governmental authorities in the event of Account suspension/closure arising from fraud investigations, violation of law investigations or violation of these terms.
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            10. No Financial Advice
                                        </div>
                                        <div className="col-12">
                                            Exireum is not your broker, intermediary, agent, or advisor and has no fiduciary relationship or obligation to you in connection with any trades or other decisions or activities effected by you using the Services. No communication or information provided to you by exireum is intended as, or shall be considered or construed as, investment advice, financial advice, trading advice, or any other sort of advice. All trades are executed automatically, based on the parameters of your order instructions and in accordance with posted trade execution procedures, and you are solely responsible for determining whether any investment, investment strategy or related transaction is appropriate for you based on your personal investment objectives, financial circumstances and risk tolerance. You should consult your legal or tax professional regarding your specific situation. Exireum does not recommend that any digital currency should be bought, earned, sold, or held by you. Before making the decision to buy, sell or hold any Digital Currency, you should conduct your own due diligence and consult your financial advisors before making any investment decision. Exireum will not be held responsible for the decisions you make to buy, sell, or hold digital currency based on the information provided by exireum.
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            11. Compliance with Local Laws
                                        </div>
                                        <div className="col-12">
                                            It is the responsibility of the user to abide by local laws in relation to the legal usage of exireum in their local jurisdiction. Users must also factor, to the extent of their local law all aspects of taxation, the withholding, collection, reporting and remittance to their appropriate tax authorities. All users of exireum and any of its services acknowledge and declare that the source of their funds come from a legitimate manner and are not derived from illegal activities. Exireum maintains a stance of cooperation with law enforcement authorities globally and will not hesitate to seize, freeze, terminate the account and funds of Users which are flagged out or investigated by legal mandate.
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            12. Resolving disputes: forum, arbiration, class action wiver, governing low
                                        </div>
                                        <div className="col-12">
                                            Notification of dispute. Please contact exireum first! exireum wants to address your concerns without resorting to formal legal proceedings. Before filing a claim, you agree to try to resolve the dispute informally by contacting exireum first through https://exireum.com/Components/Ticket
                                        </div>
                                        <div className="col-12 mt-2 font-weight-bold">
                                            13. Miscellaneous
                                        </div>
                                        <div className="col-12">
                                            a. Independent Parties. Exireum is an independent contractor and not an agent of you in the performance of these terms. These terms not to be interpreted as evidence of an association, joint venture, partnership, or franchise between the parties.
                                        </div>
                                        <div className="col-12">
                                            b. Entire agreement. These terms constitute the entire agreement between the parties regarding use of the services and will supersede all prior agreements between the parties whether, written or oral. No usage of trade or other regular practice or method of dealing between the parties will be used to modify, interpret, supplement, or alter the terms of these terms.
                                        </div>
                                        <div className="col-12">
                                            c. Force majeure. Exireum will not be liable for any delay or failure to perform as required by these terms because of any cause or condition beyond Exireum’s reasonable control.
                                        </div>
                                        <div className="col-12">
                                            d. Severability. If any portion of these terms are held invalid or unenforceable, such invalidity or enforceability will not affect the other provisions of these terms, which will remain in full force and effect, and the invalid or unenforceable portion will be given effect to the greatest extent possible.
                                        </div>
                                        <div className="col-12">
                                            e. Assignment. You may not assign or transfer any right to use the services or any of your rights or obligations under these terms without prior written consent from us, including by operation of law or in connection with any change of control. Exireum may assign or transfer any or all of its rights or obligations under these terms, in whole or in part, without notice or obtaining your consent or approval.
                                        </div>
                                        <div className="col-12">
                                            f. Waiver. The failure of a party to require performance of any provision will not affect that party’s right to require performance at any time thereafter, nor will a waiver of any breach or default of these terms or any provision of these Terms constitute a waiver of any subsequent breach or default or a waiver of the provision itself.
                                        </div>
                                        <div className="col-12">
                                            g. Third-Party website disclaimer. Any links to third-party websites from the services does not imply endorsement by exireum of any products, services or information presented therein, nor does exireum guarantee the accuracy of the information contained on them. In addition, since exireum has no control over the terms of use or privacy practices of third-party websites, you should read and understand those policies carefully.
                                        </div>
                                        <div className="col-12">
                                            h. Contact information. For more information on exireum, you can refer to the company and license information found on the website. If you have questions regarding this agreement, please feel free to contact exireum for clarification via our customer support team at https:// exireum.com/Components/Ticket
                                        </div>
                                        <a onClick={this.hideTerm} className="btn btn-warning mt-3 mb-3 small font-weight-bold text-white mx-auto">Accept</a>
                                    </div>
                                </div>
                                <div id="iran" className="col-12 small">
                                    <div className="row text-justify">
                                        <div className="col-12 font-weight-bold mt-2">
                                            شرایط اساسی و اولیه‌ی استفاده کاربران از خدمات:
                                        </div>
                                        <div className="col-12">
                                            موضوع موافقنامه‌ی حاضر، تدوین اصول اولیه از قبیل حقوق، تکالیف و مسئولیت‌ها و نیز دستورالعمل‌های لازم جهت استفاده کاربر است.
                                        </div>
                                        <div className="col-12">
                                            این شرایط برای استفاده از سایت (https://exireum.com) که از این پس سایت نامیده می شود ،تنظیم گردیده و افراد در انجام تعهدات خود، تابع قوانین بوده و از کلیه ی مقررات حاکم بر آن تبعیت می کنند.
                                        </div>
                                        <div className="col-12">
                                            آثار و تغییر در مفاد موافقنامه که از سوی ما ارائه می‌شود یا به طریق دیگری ابلاغ می‌گردد، بارگزاری خواهد شد و پس از موافقت کاربر و امضاء آن (با ثبت نام به عنوان کاربر) به مورد اجرا گذاشته می‌شود. مفاد این موافقنامه در صورت تباین با قوانین و مقررات مربوطه قابل اصلاح از سوی ما خواهد بود. در صورت اعمال هر گونه تغییر در این موافقنامه، مراتب ظرف مدت ۷ روز قبل از تاریخ اجرای تغییرات، به اطلاع کاربر خواهیم رساند.
                                        </div>
                                        <div className="col-12">
                                            ۱ـ استفاده از هرگونه امکانات سایت ( ثبت نام ـ خرید ـ فروش و هر گونه امکانات دیگر) به این معنی است که کاربر شرایط را کاملاً خوانده ، فهمیده و قبول کرده و در غیر اینصورت، حق استفاده از امکانات سایت را ندارد.
                                        </div>
                                        <div className="col-12">
                                            ۲ـ این حق برای سایت محفوظ است که در هر زمان که بخواهد، با اعلام مراتب قبلی به کاربر، مفاد این موافقتنامه را تغییر دهد.
                                        </div>
                                        <div className="col-12">
                                            ۳ـ تمامی معاملات انجام گرفته توسط کاربر صحیح تلقی می‌گردد. از این رو صیانت از حساب کاربری، رمز عبور یا سایر اطلاعات برعهده وی بوده و لازم است به صدمات ناشی از انجام تخلفات یا جرایم مالی توجه داشته باشد.
                                        </div>
                                        <div className="col-12">
                                            ۴ـ در مورد واحد پولی مجازی لومن، صادره کننده‌ای وجود ندارد و لذا هیچ شخص ثالثی از جمله ما در داخل یا خارج از ایران، ارزش یا پرداخت آن را تضمین نمی‌کند. لذا واحد پولی مجازی مانند لومن می‌تواند در کشورهای مختلف دارای ارزش های متفاوتی باشد. بنابراین، واحد پول مجازی برخلاف واحدهای پولی قانونی، دارای ریسک ذاتی است، باید به این نکته توجه نشان دهید.
                                        </div>
                                        <div className="col-12">
                                            ۵ـ معاملات لومن در استلار ثبت می‌شود تا کاربران پول مجازی بتوانند به انجام معامله اطمینان حاصل کنند. در صورتی که یکپارچگی استلار که در آن معامله تأیید می‌شود به جهاتی که قابل انتساب به اشخاص ثالث مانند مخابرات، خطا در خود استلار و غیره دچار مشکل شود، سابقه‌ی معامله تا زمان معینی در گذشته قابل بازیابی از سوی ما یا اشخاص ثالث خواهد بود.
                                        </div>
                                        <div className="col-12">
                                            ۶ـ تلاش ما ارائه‌ی خدمات به صورت ۲۴ ساعته در طول شبانه روز خواهد بود. البته این امر را تضمین نمی‌کنیم. لیکن در صورت وقوع حادثه‌ای از قبیل تعلیق خدمات به علت اقدام غیر قانونی کاربران یا اشخاص ثالث، یا وقوع خطا در خدمات، مشکل را مرتفع و ارائه‌ی خدمات را از سر می‌گیریم. در این زمان می‌توانید درخواست بازیابی را بر اساس سوابق معاملاتی ارائه کنید. اما نمی‌توانیم سود زیان ناشی از بازیابی سوابق معاملاتی را جهت جبران خسارت برای هر نوع واحد پولی مجازی دیگر یا ریال را برای شما پوشش دهیم.
                                        </div>
                                        <div className="col-12">
                                            ۷ـ در صورت وقوع خسارت به سایت، در اثر فعالیت‌های غیر قانونی کاربر، سایت می‌تواند وفق قانون نسبت به مطالبه‌ی آن اقدام کند. لذا باید با رعایت قوانین و مقررات از خدمات ما استفاده کنید.
                                        </div>
                                        <div className="col-12">
                                            ۸ ـ پس از اعلام موارد مشمول تغییر در چارچوب پاراگراف فوق و ابلاغ قصد خود به کاربر به منظور قبول موارد تغییر پس از ۷ روز از تاریخ مؤثر اعمال تغییرات مذکور، و عدم واکنش کاربر، موافقنامه‌ی اصلاحی قبول شده از سوی شما مفروض انگاشته خواهد شد. در صورت عدم توافق کاربر با موافقنامه‌ی اخیر، امکان خروج کاربر از عضویت به صورت جداگانه نیز وجود خواهد داشت.
                                        </div>
                                        <div className="col-12">
                                            ۹ـ مواردی که در این موافقنامه مضبوط نمی‌باشد، تابع قوانین و مقررات و تابع سیاست‌های عملیاتی و قواعد اعلامی از سوی ما خواهد بود. (که مجموعاً مقررات نامیده می‌شود) در صورت وجود تعارض میان مقررات و مفاد مندرج در این موافقنامه، مفاد مقررات ملاک عمل خواهد بود.
                                        </div>
                                        <div className="col-12 font-weight-bold mt-2">
                                            اول- مدیریت و حساب‌ها
                                        </div>
                                        <div className="col-12">
                                            مراحل فرایند ایجاد حساب از سوی شما به شرح ذیل است:
                                        </div>
                                        <div className="col-12">
                                            الف- کاربر پس از ورود به صفحه ثبت نام باید اطلاعات خواسته شده از جمله نام و ایمیل و شماره تلفن و... را به طور دقیق و صحیح وارد نماید.
                                        </div>
                                        <div className="col-12">
                                            ب- کاربر پس از ورود اطلاعات به صفحه کد پیامکی ارجاع داده شده و باید کد دریافت شده را وارد نماید.
                                        </div>
                                        <div className="col-12">
                                            ج- کاربر به صفحه گزینش پسورد وارد شده و باید پسورد مورد نظر خود را وارد نماید.
                                        </div>
                                        <div className="col-12">
                                            د- کاربر به صفحه ی ساخت اکانت وارد شده و باید اکانت قبلی خود را وارد نماید یا یک اکانت جدید برای خود ایجاد نماید در این صفحه قوانین و مقررات قرار داده شده است اگر این قوانین مورد پذیرش کاربر نباشد, کاربر اجازه ی ایجاد اکانت ندارد.
                                        </div>
                                        <div className="col-12">
                                            برای استفاده از خدمات ما به یک حساب نیاز داشته و موظف به استفاده از حساب ایجاد شده از طریق وارد کردن اطلاعات صحیح می باشد که کاربر در این امر نباید از اطلاعات سایر افراد سوء استفاده کرده یا قوانین و مقررات مربوطه را نقض نمایید. مشخص است از شما درخواست احراز درستی نام یا انجام فرایند راستی آزمایی از طریق مراجع حرفه‌ای را تا آن جا که قانون مجاز می‌داند درخواست می کنیم. و هدف از این امر احراز انطباق اطلاعات ارائه شده با واقعیت است.
                                        </div>
                                        <div className="col-12">
                                            در موارد ذیل می‌توانیم ایجاد حساب را مردود اعلام کرده و نسبت به حذف حساب اقدام نماییم:
                                        </div>
                                        <div className="col-12">
                                            الف- چنانچه به سن قانونی نرسیده (۱۸ سال کامل شمسی)یا از اهلیت قانونی کافی برخوردار نباشید.(مگر با دخالت ولی خاص یا قیم قانونی)
                                        </div>
                                        <div className="col-12">
                                            ب- تلاش برای ایجاد حساب از طریق ارائه‌ی اطلاعات شخصی دیگران توسط شما از قبیل نام یا آدرس پست الکترونیکی
                                        </div>
                                        <div className="col-12">
                                            ج- عدم وارد کردن اطلاعات لازم یا وارد کردن اطلاعات نادرست در زمان ایجاد حساب از سوی کاربر
                                        </div>
                                        <div className="col-12">
                                            د- چنانچه در آتیه استفاده از خدمات ما به معنای نقض قوانین حاکم تلقی گردد.
                                        </div>
                                        <div className="col-12">
                                            ه- در صورت عدم رعایت سایر قوانین و مقررات از سوی شما یا انجام اقداماتی برخلاف استانداردهای که توسط سایت اعلام می‌گردد.
                                        </div>
                                        <div className="col-12">
                                            در صورت تحقق موارد ذیل می‌توانیم فرایند ایجاد حساب از سوی شما را به حالت تعلیق درآوریم:
                                        </div>
                                        <div className="col-12">
                                            الف- در صورت عدم وجود ظرفیت لازم برای ارائه‌ی خدمات
                                        </div>
                                        <div className="col-12">
                                            ب- در صورتی که از جنبه‌ی فنی و مالی تعلیق حساب از نظرسایت لازم باشد.
                                        </div>
                                        <div className="col-12">
                                            موارد زیر را در مورد مدیریت حساب های خود در نظر داشته باشید:
                                        </div>
                                        <div className="col-12">
                                            الف- حساب شما تنها باید توسط خود شما مورد استفاده قرار گیرد و نباید تحت هیچ شرایطی به دیگران اجازه بدهید از آن استفاده کنند. در صورت اعمال تغییرات پس از ارائه‌ی خدمات، باید بلافاصله اطلاعات جدید را در بخش خدمات به روز کرده یا از ما بخواهید آن را انجام دهیم برای این کار مراتب را از طریق مرکز مشتریان یا ایمیل ارسال کرده و آخرین اطلاعات را نزد خود نگه دارد.
                                        </div>
                                        <div className="col-12">
                                            ب- در خصوص خسارات ناشی از عدم اصلاح اطلاعات یا صدمه‌ی ناشی از استفاده‌ی غیر مجاز از حساب توسط ثالث که رمز عبور شما را به سرقت برده است، مسئولیتی نخواهیم داشت. در این حالت موظف به جبران خسارت وارده به ثالث در اثر کلاهبرداری مالی خواهید بود. علاوه بر آن، در خصوص جبران خسارت ثالث از سوی شما هیچگونه مسئولیتی بر عهده‌ی ما نخواهد بود مگر آنکه اطلاعات ثبت شده ناشی از اعمال ما باشد
                                        </div>
                                        <div className="col-12 font-weight-bold mt-2">
                                            دوم ـ استفاده از خدمات
                                        </div>
                                        <div className="col-12">
                                            ۱ـ ارائه‌ی خدمات و هزینه‌ی استفاده از آن
                                        </div>
                                        <div className="col-12">
                                            الف-انواع خدمات؛ از قبیل ایجاد حساب ریالی در سایت و واریز و برداشت از اینگونه حسابها و واریز و برداشت از هر یک از حسابهای بانکی توسط کارتهای شتابی و ایجاد بازار بورس و تبدیل به ارزهای دیجیتالی با واحد پولی ایران که از طریق اینترنت می‌باید به آن‌ها وصل شوید قابل ارائه از سوی ما خواهد بود. شما می‌توانید از طریق صفحه‌ی وب به این خدمات دسترسی داشته باشید.
                                        </div>
                                        <div className="col-12">
                                            ب- برای ارائه‌ی خدمات ممکن است رضایت شما را وفق الزامات قانونی که ماهیت خدمات ایجاب می‌کند مطالبه کنیم. در این مورد می‌توانید از خدمات مختلف بر اساس توافق فی مابین استفاده کنید.
                                        </div>
                                        <div className="col-12">
                                            ج ـ برای ارائه‌ی بهتر خدمات، ممکن است اعلامیه‌های مربوط به استفاده از خدمات به نام‌های ثبت شده و انواع اطلاعات دیگر از جمله تبلیغات برای شما ارسال شود یا آن را مستقیماً به ایمیل یا تلفن همراه شما ارسال نماییم.
                                        </div>
                                        <div className="col-12">
                                            دـ در صورت وقوع خطای سیستمی در طرف استفاده از خدمات از جمله برنامه‌ها، می‌توانیم اطلاعات نادرست ناشی از خطا را حذف و اطلاعات حیاتی را بازیابی کنیم. در برخی موارد، اطلاعات مربوط به یک معامله خاص با توجه به زمان روز قابل ارائه است. اگر در این حالت اطلاعات نادرست نمایش داده شده در زمان وقوع خطای سیستمی اصلاح شود، برای نمایش اطلاعات حیاتی، اطلاعات مذکور حذف یا اصلاح خواهد شد. بنابراین با توجه به خدمات و نسبت به اطلاعات واقعی ممکن است با حقوق یا تکالیفی روبه رو شوید.
                                        </div>
                                        <div className="col-12">
                                            وـ اگرچه مفاد اصلی بر اساس موافقنامه‌ی استفاده از خدمات را از طریق تلفن، ایمیل مکتوب شما و غیره می باشد لیکن هر گونه خسارت ناشی از قصور شما در انجام تعهدات بر عهده‌ی خود شما خواهد بود.
                                        </div>
                                        <div className="col-12">
                                            ۲ـ نحوه‌ی استفاده از خدمات و موارد مهم
                                        </div>
                                        <div className="col-12">
                                            الف ـ نباید در ارائه‌ی خدمات ما دخالت کنید و از خدمات به شیوه‌ای غیر از آنچه که ما مجاز می‌دانیم استفاده کنید.
                                        </div>
                                        <div className="col-12">
                                            ب ـ رفتارهای مختلف از قبیل جمع آوری و استفاده‌ی غیر مجاز از اطلاعات کاربر، استفاده از خدمات برای اهداف تجاری (البته در صورتی که وارد قرارداد مناسب با ما شوید، استثنائاتی وجود دارد)، اعلام اطلاعات برخلاف نظم عمومی و قوانین و مقررات، انتقال اطلاعات حساب‌ها و یا قرض دادن آن و ارائه‌ی خدمات جانبی ممنوع خواهد بود.
                                        </div>
                                        <div className="col-12">
                                            ج ـ ممکن است در خصوص نقض مقررات از سوی شما دست به تحقیق بزنیم و به طور موقت یا دائمی مانع استفاده‌ی شما از خدمات بشویم اگر از قوانین و مقررات مربوط و یا توافقنامه یا سیاست‌های سایت تبعیت نکنید، حتی می‌توانیم ثبت نام مجدد شما را منوط به پرداخت وجه کنیم.
                                        </div>
                                        <div className="col-12">
                                            هـ در صورت عدم دسترسی به سوابق یا ورود جهت استفاده از خدمات در مدت قانونی، می‌توانیم اطلاعات شما را پس از اعلام موضوع از طریق پیامک یا ایمیل، امضاء کرده یا منفک سازیم و چنانچه در انجام این امر، اطلاعات لازم برای خدمات کافی نباشد،عضویت شما قابل لغو خواهد بود.
                                        </div>
                                        <div className="col-12">
                                            وـ در صورت عدم ورود برای استفاده از خدمات معین، ممکن است جهت امکان استفاده از خدمات، از شما اطلاعات دیگری مطالبه کنیم. به ویژه اگر برای ۶ ماه یا بیشتر از حساب خود استفاده نکرده باشید. که در این صورت ممکن است نسبت به تعلیق حساب، اقدام نماییم.
                                        </div>
                                        <div className="col-12">
                                            ۳ـ شرایط خدمات
                                        </div>
                                        <div className="col-12">
                                            الف- تعریف موضوع این فصل به شرح زیر است (علاوه بر این فصل، در صورتی که چارچوب موضوع امکان آن را فراهم کند، اصطلاحات به کار رفته در این موافقنامه تعریف می‌شود). تعاریف آن از اصطلاحات که در این ماده نیامده بر اساس تعاریف معمول در حوزه‌ی تجاری فعالیت ما خواهد بود. البته، در صورت عدم وجود تعریف قانونی از واحد پولی مجازی در ایران، تعریف اصطلاحات در این بخش تضمین کننده‌ی ماهیت حقوقی واحد پولی مجازی و تفسیر قانونی نخواهد بود. و نیز، در صورت وجود اختلاف میان مقامات قضایی در ایران، مراجع فوق تابع تعاریف مندرج در این موافقنامه نخواهد بود.
                                        </div>
                                        <div className="col-12">
                                            ب ـ واحد پولی مجازی اطلاعات: تنها به صورت الکترونیکی در شبکه استلار و امثال آن وجود دارد و به عنوان ابزار معامله مورد استفاده قرار می‌گیرد.
                                        </div>
                                        <div className="col-12">
                                            ج ـ ریال: واحد پولی مورد شناسایی قرار گرفته از سوی ماست که در چارچوب خدمات ارائه می‌شود. و در برابر پول نقد هنگام استفاده از خدمات ما قابل مبادله خواهد بود.
                                        </div>
                                        <div className="col-12">
                                            دـ کیف پول الکترونیکی: حساب منحصر به فردی است که امکان واریز و برداشت ریالی و ارزی دیجیتالی را برای کاربران فراهم نموده و بصورت مجاز در اختیار کاربر قرار می دهد.
                                        </div>
                                        <div className="col-12">
                                            ۳ـ در صورت وقوع شرایط ذیل، می‌توانیم تفاهمنامه را فسخ نماییم:
                                        </div>
                                        <div className="col-12">
                                            الف- وقوع هک یا شرایط معادل آن از سوی فرد ثالث غیر از کاربر موجب لغو و بی اعتباری تمامی موارد استفاده‌ی پس از زمان هک یا وضعیت معادل آن
                                        </div>
                                        <div className="col-12">
                                            ب- مشکل در ارائه‌ی خدمات ناشی از ارائه دهنده‌ی خدمات امنیتی و بستر ارائه‌ی خدمات موجب لغو و بی اعتباری تمامی معاملات پس از زمان خطای سیستمی
                                        </div>
                                        <div className="col-12">
                                            ج- باید در صورت استفاده از خدمات معاملات اکسیریوم، هزینه‌ی آن را پرداخت کنید. هزینه‌ی استفاده از این خدمات در بخش اطلاعات استفاده‌ی خدمات معاملات اکسیریوم در سایت موجود است. امکان بازنگری در هزینه‌ی استفاده از خدمات با توجه به شرایط بازار وجود دارد و اکسیریوم می‌تواند از محتوی جدید از تاریخ اجرا که در اعلامیه‌ی مربوطه اعلام می‌شود بهره ببرد.
                                        </div>
                                        <div className="col-12">
                                            د- استفاده از خدمات پرداخت شده
                                        </div>
                                        <div className="col-12">
                                            ۴- می‌توانیم مبالغ پرداخت شده از سوی کاربر را با شرایط ذیل عودت دهیم:
                                        </div>
                                        <div className="col-12">
                                            الف- چنانچه به دلایل قابل انتساب به ما، نتوانید از خدمات ما استفاده کنید.
                                        </div>
                                        <div className="col-12">
                                            ب- ارائه‌ی خدمات ممکن است برای مدت معین جهت تعمیر و نگهداری تجهیزات یا بنابر سایر دلایل متوقف شود و البته از قبل اعلامیه ای در این خصوص بر روی سایت درج خواهد شد. در صورتی که خدمت بنابر دلایلی غیر منتظره به حالت تعلیق درآید، تلاش می‌کنیم ارائه‌ی خدمات را در اولین فرصت پس از رفع مشکل از سر بگیریم.
                                        </div>
                                        <div className="col-12">
                                            ج- محتوی خدمات قابل تغییر بوده و خدمات ممکن است به علت لغو یا تغییر قرارداد با شرکت‌های مربوطه، یا ارائه‌ی خدمات یا افتتاح خدمات جدید لغو گردد.
                                        </div>
                                        <div className="col-12">
                                            د- در صورت محاسبه بیش از اندازه‌ی هزینه‌ی خدمات یا محاسبه‌ی نادرست آن ، نحوه‌ی عودت به حساب کیف الکترونیک کاربر خواهد بود.
                                        </div>
                                        <div className="col-12">
                                            ۵- استفاده، اصلاح و لغو خدمات
                                        </div>
                                        <div className="col-12">
                                            الف- تلاش ما ارائه‌ی خدمت به صورت ۲۴ ساعته در شبانه روز و ۳۶۵ روز در سال است مگر آنکه در سایت و در قالب اعلامیه مراتب دیگر را به شما اعلام نماییم.
                                        </div>
                                        <div className="col-12">
                                            ب- در صورت عدم تمایل به استفاده از خدمات یا عدم توافق با مفاد موافقنامه و اصلاحات و الحاقات بعدی، کاربر می‌تواند خواهان لغو قرارداد خدمات با استفاده از مفهومی موجود در خدمات یا با تماس با مرکز مشتریان شده و ما بر اساس مفاد قانونی عضویت شما را لغو خواهیم کرد. البته در خصوص خسارات وارده به شما در اثر لغو خدمات پیرو درخواست کاربر، هیچگونه مسئولیتی نخواهیم داشت.
                                        </div>
                                        <div className="col-12">
                                            ج- اگر شما دو یا چند بار از تمام و یا بخشی از تعهدات خود از جمله تعهدات مندرج در این موافقنامه یا مندرج در موافقنامه‌ی جداگانه‌ی خدمات یا اقدامات انجام شده از سوی ما برای توقف یا محدود کردن استفاده از خدمات شانه خالی کنید.
                                        </div>
                                        <div className="col-12">
                                            د- در صورتی که قرارداد استفاده لغو گردد، اطلاعات شما نزد ما محفوظ خواهد بود و قادر نخواهید بود حذف اطلاعات موجود را درخواست نمایید.
                                        </div>
                                        <div className="col-12">
                                            6- حفاظت از اطلاعات شخصی :
                                        </div>
                                        <div className="col-12">
                                            اطلاعات شخصی شما تنها برای موضوع مورد توافق و در چارچوب آن مورد استفاده قرار خواهد گرفت تا خدمات به طور منظم ارائه گردد. اطلاعات شخصی شما جز با رضایت جداگانه از طرف شما به ثالث ارائه نخواهد شد. در خط مشی حفاظت از اطلاعات خصوصی تفصیل مطالب آمده است. نسبت به وقوع احتمالی خسارت ناشی از کلاهبرداری مالی باید خود توجه کافی داشته باشید و اگر کلاهبردار مالی الکترونیکی موجب تحقیق از ناحیه‌ی مراجع تحقیقاتی، قضایی، اداری یا نهاد عمومی دیگری شود، می‌توانیم نسبت به تعلیق حساب شما و کیف پول الکترونیکی به طور همزمان اقدام کنیم.
                                        </div>
                                        <div className="col-12 font-weight-bold mt-2">
                                            سوم-کاربر می پذیرد که:
                                        </div>
                                        <div className="col-12">
                                            ۱- که منبع و مقصد کلیه ی ارزهای الکترونیکی و غیر الکترونیکی ارائه شده توسط وی در تراکنش های سایت کاملا قانونی و مطابق با قوانین بین المللی و مقررات جمهوری اسلامی ایران باشند.
                                        </div>
                                        <div className="col-12">
                                            -کاربر می پذیرد که مالک قانونی وجوه و حساب هایی است که وی در هر سفارش به هر نحو چه برای پرداخت و چه برای دریافت از آنها استفاده کرده است.
                                        </div>
                                        <div className="col-12">
                                            ۳-اطلاعاتی که کاربر در خلال سفارش یا ثبت نام در سایت وارد کرده است کاملا محفوظ خواهد ماند و به هیچ شخص ثالثی ارائه نخواهد شد مگر با نامه ی قضایی و یا درخواست کتبی پلیس
                                        </div>
                                        <div className="col-12">
                                            ۴-این حق برای اکسیریوم محفوظ است که هر گونه اطلاعات لازم برای احراز هویت را قبل از پدیرش از کاربر بخواهد. در این حال تا احراز هویت کامل به عمل نیامده است، عضویت کاربرامکان نخواهد داشت.
                                        </div>
                                        <div className="col-12">
                                            ۵- اکسیریوم یکسان بودن هویت گیرنده و فرستنده را بررسی نمی کند و ممکن است هویت گیرنده با فرستنده در یک تراکنش یکی باشد یا نباشد و اکسیر هیچ گونه مسئولیتی راجع به آن نمی پذیرد. اکسیر هیچ گونه مسئولیتی راجع به رابطه ی بین فرستنده با گیرنده نمی پذیرد و هیچ گونه خدمات میانجیگری و حکمیت بین گیرنده و فرستنده در یک تراکنش نمی پذیرد.
                                        </div>
                                        <div className="col-12">
                                            6-کاربر سایت می پذیرد که اکسیریوم صرفا مسئول جابه جایی مقدار مشخص شده در تراکنش(سفارش خرید و فروش ) معین است و هیچ گونه مسئولیت دیگری ندارد.
                                        </div>
                                        <div className="col-12">
                                            ۶-کارمزد خدمات اکسیر، همانطور که در سفارش و تراکنش با نرخ مشخص نشان داده شده اند دریافت می شود.
                                        </div>
                                        <div className="col-12">
                                            ۷-هر گونه کارمزد – کمیسیون و هزینه ی دیگر که سیستم بانکی جهت نقل و انتقال پول به کاربر تحمیل نماید ، بر عهده ی کاربر خواهد بود و اکسیر هیچ گونه مسئولیتی راجع به این گونه هزینه ها نمی پذیرد.
                                        </div>
                                        <div className="col-12">
                                            ۸-اکسیریوم هیچ گونه مسئولیتی راجع به تاخیر یا تراکنش ناموفق ایجاد شده در انجام سفارش به علت نقص یا مشکل یا تعمیرات سیستم ارز الکترونیکی یا بانک پذیرنده نمی پذیرد.
                                        </div>
                                        <div className="col-12">
                                            ۹-حقوق هر کاربر برای استفاده از سایت مخصوص به خود اوست و مسئولیت استفاده ی هر کاربر از نام کاربری و رمز عبور وی فقط و فقط به عهده ی کاربر خواهد بود. کاربر می پذیرد که مسئولیت کلیه ی تراکنش های انجام شده از حساب کاربری وی به عهده ی خود وی .
                                        </div>
                                        <div className="col-12">
                                            -هر گونه پیامدهای مالیاتی ناشی از تراکنش های کاربران به عهده ی خود آنان خواهد بود و اکسیریوم هیچ گونه مسئولیتی نمی پذیرد.
                                        </div>
                                        <div className="col-12">
                                            ۱۱-کاربر می پذیرد که جز در مورد انجام صحیح سفارش طبق قیمت مشخص و شفاف و کارمزد مشخص و شفاف طبق قرارداد فوق هیچ گونه ادعایی از سایت و مدیران – کارکنان – و کلیه ی مرتبطان با این سایت نداشته باشد.
                                        </div>
                                        <div className="col-12">
                                            نکات مهم در رابطه با خدمات معاملات اکسیریوم شامل موارد ذیل می‌شود. باید از این موارد آگاه بوده و آن‌ها را رعایت کنید:
                                        </div>
                                        <div className="col-12">
                                            ۱۲-خدمات معامله‌ی اکسیریوم نقش واسطه را میان کاربران بر عهده دارد و ارزش و یا بازپرداخت پول مجازی را به هیچ وجه تضمین نمی کنیم. و نیز مسئولیت منافع اقتصادی ناشی از معامله با واحد پول مجازی بر عهده‌ی کاربر خواهد بود. قیمت بازار پول مجازی که توسط ما بعضاً اعلام می‌شود ممکن است به طور موقت با قیمت واقعی همخوان نباشد که علت آن محدودیت‌های فنی از قبیل خطای سیستمی یا برنامه‌ای عدم تقارن محیطی، محدودیت در مورد فضای ارتباطی در داخل و خارج است. البته تمامی تلاش خود را برای رفع این تفاوت در قیمت انجام می‌دهیم.
                                        </div>
                                        <div className="col-12">
                                            ۱۳ـ صحت اطلاعات شخصی کاربر را که نزد ماست تضمین نمی کنیم. به محض اطمینان از عدم صحت آن موظف به قطع استفاده‌ی کاربر مربوطه از خدمات معاملات اکسیریوم خواهیم بود و اقدام متقابل را به انجام خواهیم رساند.
                                        </div>
                                        <div className="col-12">
                                            ۱۴ـ در برابر خسارات ناشی از به سرقت رفتن حساب شما توسط ثالث مسئولیتی نخواهیم داشت.
                                        </div>
                                        <div className="col-12">
                                            ۱۵ـ امکان تعیین حداقل مقدار استفاده را برای تمامی معاملات از طریق خدمات معاملات اکسیر و کسر واحد پول مجازی یا ریال کمتر از آن مقدار وجود خواهد داشت در این حالت، بابت آن کاهش مسئولیتی نخواهیم داشت.
                                        </div>
                                        <div className="col-12">
                                            ۱۶ـ صحت اطلاعات شخصی کاربر را که در اعتبار ما هست تضمین نمی‌کنیم و به محض احراز خلاف واقع بودن آن، مکلف به قطع خدمات بازپرداخت خارجی برای کاربر مربوطه و انجام اقدامات متقابل هستیم.
                                        </div>
                                        <div className="col-12">
                                            ۱۷ـ مسئولیت خسارت ناشی از سرقت حساب از سوی ثالث بر عهده‌ی ما نخواهد بود.
                                        </div>
                                        <div className="col-12">
                                            ۱۸ـ در صورتی که حساب شما را قطع یا متوقف کنیم، موظف به انجام امور ذیل خواهید بود.
                                        </div>
                                        <div className="col-12">
                                            ۱۹ـ در صورت تعلیق حساب، تحقیقات اولیه در مورد حساب انجام داده و موظف خواهید بود که با ما همکاری کامل به عمل آورید.
                                        </div>
                                        <div className="col-12">
                                            ۲۰ـ در صورت تعلیق حساب، نمی‌توانید ریال را سپرده‌گذاری کرده یا مسترد دارید و نمی‌توانید معاملات را از طریق کیف پول الکترونیکی انجام دهید.
                                        </div>
                                        <div className="col-12">
                                            ۲۱ـ پس از تحقیقات داخلی در خصوص حساب، ممکن است نسبت به تعطیلی حساب که هفت روز پس از ابلاغ اولیه صورت خواهد پذیرفت، اقدام کنیم. علاوه بر این، دلایل تعطیلی حساب به شما ابلاغ و می‌توانید برای این اقدام به شیوه‌ی شخصی عمل کنید
                                        </div>
                                        <div className="col-12">
                                            ۲۲ـ می‌توانید موجودی مجازی کیف الکترونیکی خود را در طول دوره‌ی هفت روزه ابلاغ تصفیه کنید. با انقضاء مدت مذکور، خود نسبت به تصفیه‌ی آن بر اساس نرخ بازار در زمان تصفیه در چارچوب خدمات معاملاتی ما اقدام خواهیم نمود. و باقی مانده‌ی ریال را به آدرس استرداد ثبت شده در اطلاعات کاربر عودت خواهیم داد
                                        </div>
                                        <div className="col-12">
                                            ۲۳ـ اطلاعات دقیق در خصوص استرداد ریال شامل آدرس استرداد وجه را به ما اعلام خواهید کرد. با استرداد ریال، مسئولیت خسارت ناشی از اطلاعات غلط نخواهید بود مانند موردی که اطلاعات غلط داده و ما از آن اطلاعات برای استرداد ریال استفاده کنیم
                                        </div>
                                        <div className="col-12">
                                            ۲۴ـ ریال ها را با توجه به میزان پول نقد در کیف پول ریال حساب خود دریافت خواهید کرد چنانچه اطلاعات مورد درخواست ما را ارائه کرده و پول نقد را به حساب مالی مجازی مربوط به عضویت شما پرداخت کنیم.
                                        </div>
                                        <div className="col-12">
                                            ۲۵ـ همواره می‌توانید پول نقد معادل ریال خود را که در کیف پول حساب شماست دریافت دارید. که به تعیین آن از سوی ما بستگی خواهد داشت. البته تعهدی به پرداخت سود مربوط برای ریال موجود در کیف الکترونیکی ریال شما نخواهیم داشت.
                                        </div>
                                        <div className="col-12">
                                            ۲۶ـ ما از ریال ای موجود در نزد دارنده بدون رضایت وی استفاده نخواهیم کرد.
                                        </div>
                                        <div className="col-12">
                                            ۲۷ـ می‌توانیم مبادله‌ی ریال را در شرایط ذیل ممنوع کرده و البته ممنوعیت و علت آن را به شما اعلام خواهیم کرد.
                                        </div>
                                        <div className="col-12">
                                            الف ـ چنانچه درخواست کتبی از محاکم و نهادهای دولتی در این خصوص ارائه شود. ب ـ در صورتی که مبلغ مبادله بسیار زیاد باشد. ج ـ در صورتی که کاربر مرتکب جرم شده یا مظنون به تملک عواید از محل ارتکاب جرم باشد. دـ در سایر موارد چنانچه محدود کردن استفاده از خدمات پرداخت بر اساس سیاست عملیاتی ما ضروری تشخیص داده شود. ۶ـ سایر موارد ۱/۶ ـ در حدود قانون هیچگونه تعهد یا ضمانتی برای اموری خاص مسکوت مانده در این موافقنامه از حیث ارائه‌ی خدمات بر عهده نمی گیریم. علاوه بر این، در خصوص محصولات یا ارزش واحد پول مجازی که خود آن را صادر نکرده یا واگذار ننموده و همچنین پرداخت آن را ضمانت ننموده ایم، هیچ گونه تعهدی نخواهیم داشت. ۲/۶ـ در چارچوب این موافقنامه مسئول جبران خسارات خواهیم بود چنانچه خسارات وارده ناشی از اهمال یا عمل ما باشد. البته خصوص خسارات ذیل، تنها واحد پول مجازی و ریال را که معادل نتیجه پس از حذف خطا از جزئیات معامله‌ی اولیه است که در حدود اطلاعات موجود نزد ما آن را پذیرفته‌ایم نسبت به بازپرداخت اقدام خواهیم کرد. و جدا از این، مسئولیتی بر عهده‌ی ما نخواهد بود. علاوه بر این، در برابر خسارات تنبیهی، ویژه و غیر مستقیم جز در موارد قانونی مسئولیتی نخواهیم داشت. ۳/۶ـ در صورتی که خدمات در اثر اقدام شما دچار مشکل شود. ۴/۶ـ خسارات ناشی از فرایند ورود به خدمات و استفاده از آن ۵/۶ـ خسارات ناشی از دسترسی غیر قانونی ثالث به سرو و استفاده غیر قانونی از آن ۶/۶ـ ضررهای ناشی از انتقال و انتشار بد افزارها از سوی ثالث ۷/۶ـ ضررهای ناشی از استفاده ثالث از خدمات، خساراتی ناشی از دور زدن، حذف یا نابودی اطلاعات ارسال شده . ۸/۶ـ ضررهای ناشی از قصور در خدمات ارتباطاتی توسط بستر ارائه خدمات. به ویژه مواردی که ارائه دهنده خدمات ارتباطاتی در صورت وجود رابطه حقوقی فی ما بین ما و کاربران موجب ناتوانی ما در ارائه‌ی خدمات شود و غیر قابل کنترل باشد. ضررهای ناشی از موارد قهریه از قبیل جنگ، آتش سوزی، زلزله و سایر بلایای طبیعی و موارد اضطراری ملی ضررهای ناشی از ویژگی های خاص پول مجازی. به ویژه مواردی که موجب نقص یا محدودیت فنی در سیستم مدیریت. در ارائه‌ی خدمات از سوی ما می‌شود. ۹/۶ـ در صورتی که سرورها را برای ارائه‌ی خدمات قطع نظر از دلایل و نوع بازرسی از قبیل بازرسی تصادفی، دوره ای ناموقت و اضطراری) مورد بازرسی قرار دهیم. ۱۰/۶ـ سایر خسارات ناشی از دلایلی که ناشی از اعمال یا عمل ما نباشد. ۱۱/۶ـ ارائه‌ی خدمات را می‌توانیم متوقف کرده یا تمامی یا بخشی از این موافقنامه را فسخ نماییم چنانچه اطلاعات ارائه شده از سوی شما با واقعیت همخوانی نداشته باشد. در صورتی که خسارتی متوجه ما شود، می‌توانیم از شما خسارت مذکور را به حساب شما منظور نماییم. ۱۲/۶ـ در صورتی که باعث خسارات ذیل این ماده از ما مطالبه‌ی خسارت نمایید، می‌توانیم از طریق پول مجازی در واحد ریال در کیف الکترونیکی شما که تعلق آن به شما مورد تأیید است ولو با آن موافق نباشید منظور نماییم. ۱۳/۶ـ در صورت ورود خسارت به ما که ناشی از فعالیت های غیر قانونی است. می‌توانید حق مطالبه‌ی خسارت علیه شما به موجب قانون استفاده کنیم. لذا لازم است از خدمات در چارچوب قوانین و مقررات استفاده نمایید.
                                        </div>
                                        <div className="col-12 font-weight-bold mt-2">
                                            چهارم ـ حل اختلاف
                                        </div>
                                        <div className="col-12">
                                            این موافقنامه یا خدمات بر اساس قوانین جمهوری اسلامی ایران، قطع نظر از تابعیت یا محل سکونت کاربر تفسیر شده و تابع آن خواهد بود. قانون حاکم به حل و فصل اختلافات تابع قوانین ایران است. البته در صورتی که قانون مشخص یا رأی دادگاه در پیرامون پول مجازی و غیره وجود نداشته باشد، رویه یا باور قوی خارج از این کشور می‌توانید در چارچوب قوانین و مقررات راجع به اختلاف ذیل این موافقنامه یا خدمات موجد اثر گردد. با بروز اختلاف فی ما بین ما و کاربر در خصوص استفاده از خدمات، تلاش می‌کنیم این اختلاف مرتفع گردد در صورت ادامه اختلاف امکان طرح دعوی از طریق ارجاع به داوری، ذیل قانون آیین دادرسی مدنی وجود خواهد داشت.
                                        </div>
                                        <a onClick={this.hideTerm} className="btn btn-warning mt-3 mb-3 small font-weight-bold text-white mx-auto">پذیرفتن</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Account;
