import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faEye} from '@fortawesome/free-solid-svg-icons';
import {Container, Row, Col} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';

class Ticket extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createTicket = this.createTicket.bind(this);
        this.response = this.response.bind(this);
        this.state = {
            load: false,
            ticket: false,
            ticket2:false
        }
    }

    componentWillMount() {
        if (!(this.Auth.getToken())) {
            window.location.replace('/Components/Login');
        }
    }

    componentDidMount()
    {
        const url = `${this.Auth.domain}/user/ticket`;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.get(url, config)
            .then(response => {
                this.setState({
                   data: response.data.data
                });
            })
    }

    handleChange(e)
    {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    handleSubmit(e)
    {
        e.preventDefault();
        this.setState({
            load: !this.state.load
        });
        const url = `${this.Auth.domain}/user/ticket`;
        const formData = {
            title: this.state.title,
            text: this.state.text
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.post(url, formData, config)
            .then(response => {
                this.setState({
                    mess: response.data.message
                })
                setTimeout(function() {
                        window.location.replace('/Components/Ticket');
                }.bind(this), 2000)
            })
    }

    createTicket(e)
    {
        e.preventDefault();
        this.setState({
            ticket: true,
        })
    }

    response(e)
    {
        e.preventDefault();
        this.setState({
           ticket2: true,
        });
        let tag = e.currentTarget.dataset.id;
        const url = `${this.Auth.domain}/user/ticket/` + tag;
        console.log(url);
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = { headers };
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    data2: response.data.data
                })
            })
    }

    render() {
        let loader = "";
        if(this.state.load == false)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 mb-3 shadow-lg text-light">SUBMIT</button>;
        }
        else if(this.state.load == true)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 mb-3 shadow-lg text-light">
                <Loader
                    type="ThreeDots"
                    color="#fff"
                    height="20"
                    width="40"
                />
            </button>;
        }
        let signers;
        if (this.state.data) {
            signers = this.state.data.map((elem , index) => {
                let id = elem.id;
                let date = elem.created_at;
                let title = elem.title;
                let status = elem.status.value;
                let message;
                if (status == 0)
                {
                    message = 'Unanswered';
                }
                else if(status == 1)
                {
                    message = 'Answered';
                }
                else if(status == 2)
                {
                    message = 'Inprogress';
                }
                else if(status == 3)
                {
                    message = 'Closed';
                }
                else if(status == 4)
                {
                    message = 'Suspend';
                }
                return <div key={index} className="row" style={{backgroundColor: (index%2 === 0 ? '#ffc107' : '#151d2e')}}>
                    <div className="col-sm-1 col-12 text-center text-light pt-2 pb-2">{id}</div>
                    <div className="col-sm-3 col-12 text-center text-light pt-2 pb-2">{date}</div>
                    <div className="col-sm-3 col-12 text-center text-light pt-2 pb-2">{title}</div>
                    <div className="col-sm-3 col-12 text-center text-light pt-2 pb-2">{message}</div>
                    <a  className="col-sm-2 col-12 text-center text-light pt-2 pb-2" data-id={id} onClick={this.response }><FontAwesomeIcon className="" icon={faEye}/></a>
                </div>
            })
        }
        if (this.state.data2) {
            signers = this.state.data2.map((elem , index) => {
                let date = elem.created_at;
                let text = elem.text;
                let user = elem.user_type;
                return <div key={index} className="row border border-warning rounded shadow-lg mt-3">
                    {/*<div className="col-sm-1 col-12 text-center text-light pt-2 pb-2">{id}</div>*/}
                    <div className="col-sm-6 col-12 text-left text-light pt-2 pb-2 border-bottom border-warning">Type : {user}</div>
                    <div className="col-sm-6 col-12 text-left text-light pt-2 pb-2 border-bottom border-warning">Date : {date}</div>
                    <div className="col-12 text-left text-light pt-2 pb-2">Comment : {text}</div>
                </div>
            })
        }
        let mess = '';
        if(this.state.mess)
        {
            mess = <div className="col-12">
                <div className="col-12 bg-success text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your message submited
                </div>
            </div>;
        }
        if(this.state.ticket == false && this.state.ticket2 == false) {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Support</h2>
                        <div className="col-12 mt-3">
                            <div className="row">
                                <a className="col-12" onClick={this.createTicket}>
                                    <div class="col-12 col-sm-3 bg-warning pt-2 pb-2 text-center text-light rounded shadow-lg mx-auto">CREATE TICKET</div>
                                </a>
                                <div className="col-12 border border-warning mt-3 rounded shadow-lg mb-5">
                                    <div className="row mt-3 mb-3">
                                        <div className="col-12">
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-sm-1 col-12 text-center text-light pt-2 pb-2">Id</div>
                                                    <div className="col-sm-3 col-12 text-center text-light pt-2 pb-2">Date</div>
                                                    <div className="col-sm-3 col-12 text-center text-light pt-2 pb-2">Title</div>
                                                    <div className="col-sm-3 col-12 text-center text-light pt-2 pb-2">Status</div>
                                                    <div className="col-sm-2 col-12 text-center text-light pt-2 pb-2">View</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="col-12">{signers}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if(this.state.ticket == true)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        {mess}
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Support</h2>
                        <form className="col-12" onSubmit={this.handleSubmit}>
                            <label className="col-12 mt-3">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Title</span>
                                    <input className="col-9 text-center rounded-right p-2" placeholder="" name="title" type="text" onChange={this.handleChange}/>
                                </div>
                            </label>
                            <label className="col-12 mt-3">
                                <div className="row shadow-lg">
                                    <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Text</span>
                                    <textarea className="col-9 text-center rounded-right p-2" name="text" type="text" onChange={this.handleChange}></textarea>
                                </div>
                            </label>
                            {loader}
                        </form>
                    </div>
                </div>
            );
        }
        else if(this.state.ticket2 == true)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h2 className="col-12 text-light text-center font-weight-bold mb-5">Support</h2>
                        <div className="col-12">
                            <form className="col-12 border border-warning rounded shadow-lg" onSubmit={this.addText}>
                                <label className="col-12 mt-3">
                                    <div className="row shadow-lg">
                                        <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Text</span>
                                        <textarea className="col-9 text-center rounded-right p-2" name="text" type="text" onChange={this.handleChange}></textarea>
                                    </div>
                                </label>
                                {loader}
                            </form>
                        </div>
                        <div className="col-12">
                            <div className="col-12">{signers}</div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
export default Ticket;