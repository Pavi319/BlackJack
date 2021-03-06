import React, { Component } from 'react';
import './Register.css'
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import classes from './Register.css'
class Register extends Component { 
    state = {
        username:'',
        email: "",
        password: "",
        repeatedPassword :'',
        samePassword: false,
        alreadyExists: false,
        message: null,
        redirect : ''
    }

    usernameChangeHandler = (event) => {
        this.setState({
            username : event.target.value
        })
    }

    emailChangeHandler = (event) => {
        this.setState({
            email : event.target.value
        })
    }

    passChangeHandler = (event) => {
        this.setState({
            password : event.target.value
        })
    }

    repeatPassChangeHandler = (event) => {
        this.setState({
            repeatedPassword : event.target.value
        })
    }

    loginHandler =async () => {
        await this.setState({
            redirect: 'login'
        })
    }

        registerUser = () => {
            const creds = {
                ...this.state
            }
            let request = {
                method: 'POST',
                headers : {
                    'Content-Type': '(application/json)',
                },
                body: JSON.stringify(creds),
            }
            axios.post('http://localhost:5000/register',request)
            .then(response => {
                this.setState({
                   alreadyExists: response.data.alreadyExists,
                   samePassword : response.data.samePassword,
                   message : response.data.message
                })
            })
            .catch((err) => {
                console.log('Error is',err)
            })
    }
    render(){
        let redirect = null;
        let errorMessage= null;
        if(this.state.redirect !== ''){
            redirect = <Redirect to = {`/${this.state.redirect}`}/>
        }
        if (this.state.alreadyExists !== false)
        {
            errorMessage = 'There is already an account with this email!';
        }
        if (this.state.samePassword !== false)
        {
            errorMessage = 'Passwords are not the same!';
        }
        return (
            <form method="POST" className={classes.Form}>
                <h1>REGISTER</h1>
                {redirect}
                {errorMessage}
                {this.state.message}
                <p>Username</p>
                <input
                    name="email"
                    type="text"
                    placeholder="Enter your username"
                    onChange = {this.usernameChangeHandler}
                />
                <p>Email</p>
                <input
                    name="email"
                    type="text"
                    placeholder="Enter your email"
                    onChange = {this.emailChangeHandler}
                    />
                <p>Password</p>
                <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange = {this.passChangeHandler}
                />
                <p>Repeat Password</p>
                <input
                    name="repeatPassword"
                    type="password"
                    placeholder="Enter your password again"
                    onChange = {this.repeatPassChangeHandler}
                    />
                <button type = "button" onClick={this.registerUser}>Submit!</button>
                <p>You already have an account?</p><br/>
                <button type='button' onClick={this.loginHandler}>Login!</button>
            </form>
        )                        
    }
};
export default Register;