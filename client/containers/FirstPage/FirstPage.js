import React, { Component } from 'react';
import {  Redirect } from 'react-router-dom';

import classes from './FirstPage.css'

class FirstPage extends Component {
    state={
        redirect: ''
    }
    singUpHandler = () => {
        this.setState({
            redirect: 'Register'
        })
    }
    loginHandler = () => {
        this.setState({
            redirect: 'Login'
        })
    }

    render(){
        let redirect = null;
        if(this.state.redirect==='Register'){
            redirect=<Redirect to= '/Register'/>
        }
        else if(this.state.redirect==='Login'){
            redirect=<Redirect to= '/Login'/>
        }
        return(
            <div className={classes.Container}>
                {redirect}
                <h1>Welcome to BlackJack!</h1>
                <div className={classes.SignUpContainer}>
                    <p>Are you new? Please sing up!</p>
                    <button type='button' onClick={this.singUpHandler} className={classes.FirstPageButton}>Sign Up!</button>
                </div>
                <div className={classes.LoginContainer}>
                    <p>You already have an account?</p><br/>
                    <button type='button' onClick={this.loginHandler} className= {classes.FirstPageButton}>Login!</button>
                </div>
            </div>
        )
    }
}

export default FirstPage