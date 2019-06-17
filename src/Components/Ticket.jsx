import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {} from 'bootstrap-4-react';
import AuthService from './AuthService.jsx';
import Loader from 'react-loader-spinner';

class Ticket extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createTicket = this.createTicket.bind(this);
        this.clickPrevButton = this.clickPrevButton.bind(this);
        this.clickNextButton = this.clickNextButton.bind(this);
        this.response = this.response.bind(this);
        this.addText = this.addText.bind(this);
        this.return = this.return.bind(this);
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
                    data: response.data.data,
                    currentPage: response.data.current_page
                });
                if (response.data.next_page_url) {
                    this.setState({
                        nextPage: response.data.next_page_url,
                    });
                }
                else
                {
                    this.setState({
                        nextPage: null,
                    });
                }
                if (response.data.prev_page_url) {
                    this.setState({
                        prevPage: response.data.prev_page_url,
                    });
                }
                else
                {
                    this.setState({
                        prevPage: null,
                    });
                }
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
        this.setState({
            tags : tag
        });
        const url = `${this.Auth.domain}/user/ticket/` + tag;
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
                });
            })
    }

    addText(e)
    {
        e.preventDefault();
        const url = `${this.Auth.domain}/user/ticket/` + this.state.tags;
        const formData = {
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
                    messag: response.data.message
                });
                setTimeout(function() {
                    window.location.replace('/Components/Ticket');
                }.bind(this), 2000)
            })
    }

    return(e)
    {
        e.preventDefault();
        window.location.replace('/Components/Ticket');
    }

    clickNextButton(e)
    {
        e.preventDefault();
        const url = this.state.nextPage;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    currentPage: response.data.current_page,
                    data: response.data.data,
                });
                if (response.data.next_page_url) {
                    this.setState({
                        nextPage: response.data.next_page_url,
                    });
                }
                else
                {
                    this.setState({
                        nextPage: null,
                    });
                }
                if (response.data.prev_page_url) {
                    this.setState({
                        prevPage: response.data.prev_page_url,
                    });
                }
                else
                {
                    this.setState({
                        prevPage: null,
                    });
                }
            });
    }

    clickPrevButton(e)
    {
        e.preventDefault();
        const url = this.state.prevPage;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.Auth.getToken()}`,
        };
        var config = {headers};
        return axios.get(url, config)
            .then(response => {
                this.setState({
                    currentPage: response.data.current_page,
                    data: response.data.data,
                });
                if (response.data.next_page_url) {
                    this.setState({
                        nextPage: response.data.next_page_url,
                    });
                }
                else
                {
                    this.setState({
                        nextPage: null,
                    });
                }
                if (response.data.prev_page_url) {
                    this.setState({
                        prevPage: response.data.prev_page_url,
                    });
                }
                else
                {
                    this.setState({
                        prevPage: null,
                    });
                }
            });
    }

    render() {
        let leftButton= "";
        if(this.state.nextPage)
        {
            leftButton = <button onClick={this.clickNextButton} className="rounded bg-white text-secondary shadow-lg border border-warning">
                <FontAwesomeIcon className="" icon={faAngleLeft}/>
            </button>;
        }
        let rightButton= "";
        if(this.state.prevPage)
        {
            rightButton = <button onClick={this.clickPrevButton} className="rounded bg-white text-secondary shadow-lg border border-warning">
                <FontAwesomeIcon className="" icon={faAngleRight}/>
            </button>;
        }
        let loader = "";
        if(this.state.load === false)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 mb-3 text-light">SUBMIT</button>;
        }
        else if(this.state.load === true)
        {
            loader = <button className="col-12 bg-warning p-2 rounded mt-3 mb-3 text-light">
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
                if (status === 0)
                {
                    message = 'Unanswered';
                }
                else if(status === 1)
                {
                    message = 'Answered';
                }
                else if(status === 2)
                {
                    message = 'Inprogress';
                }
                else if(status === 3)
                {
                    message = 'Closed';
                }
                else if(status === 4)
                {
                    message = 'Suspend';
                }
                return <a key={index} className="" data-id={id} onClick={this.response}>
                    <div className="row smallText cursor border-top border-warning text-secondary">
                        <div className="col-sm-3 col-12 text-center pt-2 pb-2">{id}</div>
                        <div className="col-sm-3 col-12 text-center pt-2 pb-2">{date}</div>
                        <div className="col-sm-3 col-12 text-center pt-2 pb-2">{title}</div>
                        <div className="col-sm-3 col-12 text-center pt-2 pb-2">{message}</div>
                    </div>
                </a>
            })
        }
        let signers2;
        if (this.state.data2) {
            signers2 = this.state.data2.map((elem , index) => {
                let date = elem.created_at;
                let text = elem.text;
                let user = elem.user_type;
                return <div key={index} className="row text-secondary smallText border border-warning rounded shadow-lg mt-3">
                    {/*<div className="col-sm-1 col-12 text-center text-light pt-2 pb-2">{id}</div>*/}
                    <div className="col-sm-6 col-12 text-left pt-2 pb-2 border-bottom border-warning">Author : {user}</div>
                    <div className="col-sm-6 col-12 text-left pt-2 pb-2 border-bottom border-warning">Date : {date}</div>
                    <div className="col-12 text-left pt-2 pb-2">Comment : {text}</div>
                </div>
            })
        }
        let mess = '';
        if(this.state.mess)
        {
            mess = <div className="col-12">
                <div className="col-12 bg-success text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your ticket has been submited
                </div>
            </div>;
        }
        let messag = '';
        if(this.state.messag)
        {
            messag = <div className="col-12">
                <div className="col-12 bg-success text-light p-2 mb-2 rounded shadow-lg text-center mb-5">
                    Your ticket has been submited
                </div>
            </div>;
        }
        if(this.state.ticket === false && this.state.ticket2 === false) {
            return (
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        <h4 className="col-12 text-center mt-3">Support</h4>
                        <div className="col-12 mt-3">
                            <div className="row">
                                <a className="col-12 cursor" onClick={this.createTicket}>
                                    <div className="col-12 col-sm-3 bg-warning pt-2 pb-2 text-center text-light rounded shadow-lg mx-auto smallText font-weight-bold">CREATE TICKET</div>
                                </a>
                                <div className="col-12 border border-warning mt-3 rounded shadow-lg mb-2">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row text-secondary smallText">
                                                <div className="col-sm-3 col-12 text-center border-right border-warning pt-2 pb-2">Id</div>
                                                <div className="col-sm-3 col-12 text-center border-right border-warning pt-2 pb-2">Date</div>
                                                <div className="col-sm-3 col-12 text-center border-right border-warning pt-2 pb-2">Title</div>
                                                <div className="col-sm-3 col-12 text-center pt-2 pb-2">Status</div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            {signers}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 text-center mb-5">
                                    <div className="row text-secondary">
                                        <div className="col-5 text-right">{leftButton}</div>
                                        <div className="col-2 text-center border border-warning rounded shadow-lg pr-0 pl-0">{this.state.currentPage}</div>
                                        <div className="col-5 text-left">{rightButton}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if(this.state.ticket === true)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        {mess}
                        <h4 className="col-12 text-center mb-3 mt-3">Support</h4>
                        <a className="col-12" onClick={this.return}>
                            <div className="col-3 bg-warning text-center rounded shadow-lg text-light pt-2 pb-2 cursor">
                                RETURN
                            </div>
                        </a>
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
        else if(this.state.ticket2 === true)
        {
            return(
                <div className="col-sm-8 col-12 clearfix mx-auto">
                    <div className="row">
                        {messag}
                        <h4 className="col-12 text-center mt-3">Support</h4>
                        <div className="col-12">
                            <a className="col-12" onClick={this.return}>
                                <div className="col-3 bg-warning text-center rounded shadow-lg text-light pt-2 pb-2 cursor">
                                    RETURN
                                </div>
                            </a>
                            <form className="col-12 border border-warning rounded shadow-lg" onSubmit={this.addText}>
                                <label className="col-12 mt-3">
                                    <div className="row">
                                        <span className="col-3 text-center text-light p-2 rounded-left bg-warning">Text</span>
                                        <textarea className="col-9 text-center rounded-right p-2" name="text" type="text" onChange={this.handleChange}></textarea>
                                    </div>
                                </label>
                                {loader}
                            </form>
                        </div>
                        <div className="col-12">
                            <div className="col-12">{signers2}</div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
export default Ticket;