import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';
import NumberFormat from 'react-number-format';
class DepositXirWithIpg extends Component {

    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            price: null,
            secret_key:'',
            xdr: null,
            public_key:'',
            load: false,
            xirBalance: '',
            xlmBalance: '',
            entry: '',
            userAmount: false,
        }
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            });
        let amount =  parseFloat(e.target.value.replace(/,/g, ''));
        var url= `${this.Auth.domain}/user/convert?type=IRRTOXIR&amount=` + amount;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.get(url, config)
            .then(response =>{
                this.setState({
                    rial: response.data.result
                })
            });
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount() {
        const url = this.Auth.getDomain() + '/user/account';
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    public_key: response.data[0].public_key
                });
                this.assetAmount(this.state.public_key);
            })
    }

    assetAmount(public_key) {
        const url = 'https://horizon.stellar.org/accounts/' + public_key;
        return axios.get(url)
            .then(res =>{
                this.setState({
                   entry: res.data.subentry_count,
                });
                res.data.balances.map(elem =>{
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
        if(parseFloat(this.state.amount.replace(/,/g, '')) >= 10000 && parseFloat(this.state.amount.replace(/,/g, '')) <= this.state.xirBalance)
        {
            this.setState({
               load: !this.state.load
            });
            const url = `${this.Auth.domain}/user/deposit`;
            const formData = {
                amount: parseFloat(this.state.amount.replace(/,/g, '')),
                public_key: this.state.public_key,
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
                        window.location.replace(this.Auth.getDomain()+"/user/order/pay/" + response.data.order_id );
                    }
                })
                .catch(err =>{
                    this.setState({
                        load: false
                    })
                })
        }
        else
        {
            this.setState({
                userAmount: true
            })
        }
    }

    render() {
        let priceXlm = '';
        if(this.state.xirBalance)
        {
            priceXlm = parseInt(this.state.xirBalance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' XIR';
        }
        // let account = this.props.d.session.account;
        // let allBalances = account.getSortedBalances();
        // let  temp = allBalances.map(elem =>{
        //
        //     if(elem.code=="EXIR")
        //     {
        //         return (<div className="accept_xir2">
        //             <div>XIR accepted</div>
        //         </div>);
        //     }
        // })
        //
        // console.log(temp.length);
        // if (temp.length > 1) {
        //     data  = temp ;
        // }
        let failAmount= '';
        if(this.state.userAmount === true)
        {
            failAmount = <div className="col-12">
                <div className="col-12 bg-danger text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your amount should be between 10000 and {priceXlm}
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
        let exir = '';
        if(this.state.rial) {
            exir = this.state.rial.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return(
            <div className="col-12">
                <div className="row">
                    <div className="col-12 alireza">
                        <div className="col-sm-8 col-12 clearfix mx-auto mt-3 mb-5">
                            <div className="row">
                                {failAmount}
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-sm-9 col-12 bg-light mx-auto rounded shadow-lg mt-5 small pb-2">
                                            <div className="row">
                                                <div className="col-12 mt-2 text-center">To deposit XIR,</div>
                                                <div className="col-12 mt-2 mb-2 text-center">enter the amount of XIR you are going to deposit.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="col-sm-8 col-12 clearfix mx-auto border border-warning shadow-lg rounded mt-3 mb-3">
                            <div className="row">
                                <div className="col-12 border-bottom border-warning">
                                    <div className="row mt-2 mb-2">
                                        <div className="col-sm-1 d-none d-sm-block icon10"> </div>
                                        <div className="col-sm-11 pl-0 d-none d-sm-block small font-weight-bold">Deposit XIR with ipg</div>
                                        <div className="col-12 d-sm-none d-bolck small font-weight-bold">Deposit XIR with ipg</div>
                                    </div>
                                </div>
                                <form className="col-12" onSubmit={this.handleFormSubmit}>
                                    <div className='col-12 text-center mt-3 small font-weight-bold'>Available : {priceXlm}</div>
                                    <label className="col-12 mt-3">
                                        <div className="row">
                                            <span className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Amount XIR (Exir)</span>
                                            {/*<input className="col-9 p-2 rounded-right text-center" placeholder="" name="amount" minLength="5" type="tel" onChange={this.handleChange}/>*/}
                                            <NumberFormat required='required' className="col-sm-9 col-12 text-center rounded input2 pt-1 pb-1" thousandSeparator={true} minLength="5" name="amount" onChange={this.handleChange} />
                                        </div>
                                    </label>
                                    <label className="col-12 mt-2">
                                        <div className="row">
                                            <span className="col-sm-3 col-12 pt-1 pb-1 small font-weight-bold">Amount will be IRR (Rial)</span>
                                            <div className="col-sm-9 pt-1 pb-1 rounded border-div2 text-center">  {exir}  </div>
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
}
export default DepositXirWithIpg;