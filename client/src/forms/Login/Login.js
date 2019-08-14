import React, { Component } from 'react';
import axios from 'axios';
import {  Redirect } from 'react-router-dom';
import {connect} from 'react-redux'
import Cookies from 'universal-cookie';
class Login extends Component{
    state = {
        email: "",
        password: "",
        redirectPath:'',
        wrongCreditials: false,
        unRegistered: false,
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

    loginUser = () => {
        const creds = {
            ...this.state
        }
        let request = {
            method: 'POST',
            headers : {
                'Content-Type': '(application/json)',
            },
            withCredentials: true,
            body: JSON.stringify(creds),
        }
        axios.post('http://localhost:5000/login',request)
             .then(response => {
                    this.setState({
                        redirectPath: response.data.redirect,
                        unRegistered : response.data.unRegistered,
                        wrongCreditials : response.data.wrongCreditials,
                    })
                    this.props.saveIdHandler(response.data.id);
                    this.props.saveJwtHandler(response.data.token);
                    this.props.saveExpDate(response.data.createdAt,response.data.expiresAt)
                    const cookies = new Cookies();
                    cookies.set('jwt',response.data.token)
                    cookies.set('userId',response.data.id)
                    cookies.set('createdAt',response.data.createdAt)
                    cookies.set('expiresAt',response.data.expiresAt)

             })
            .catch((err) => {
                console.log('Error is',err)
            })
    }
    render(){
        let errorMessage= null;
        let redirect = null;
        if(this.state.redirectPath !== '') {
            if(this.state.redirectPath === 'playGame')
            redirect = <Redirect to = {'/playGame/'}/>
        }
        else {
            redirect = <Redirect to = '/login' />
            // this.setState({wrongCreditials: true})
        }
        if(this.state.unRegistered === true && this.state.redirectPath === 'login')
        {
            errorMessage = 'The account you have entered is invalid or the mail has not been confirmed yet!'
        } else if(this.state.wrongCreditials === true){
            errorMessage = 'The account you have entered does not exist!'
        }
        return (
            <form method="POST" /*onSubmit={this.loginUser}*/>
                {redirect}
                <h1>LOG IN</h1>
                {errorMessage}
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
                <button type="button" onClick={this.loginUser}>Submit!</button>
            </form>
        )
    }

};
const mapStateToProps = state => {
    return {
        jwt : state.jwt,
        userId: state.userId,
    }
}
const mapDispatchToProps = dispatch => {
    return {    
        saveJwtHandler: (jwt) => dispatch({type: 'SAVE_JWT',value : jwt}),
        saveIdHandler: (userId) => dispatch({type: 'SAVE_ID',value : userId}),
        saveExpDate: (createdAt,expiresAt) => dispatch({type: 'SAVE_DATE',createdAt: createdAt,expiresAt: expiresAt})
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Login);
