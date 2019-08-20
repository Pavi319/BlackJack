import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';
import {connect} from 'react-redux';

import DeckBuilder from '../DeckBuilder/DeckBuilder'
import Login from '../../forms/Login/Login'
import Register from '../../forms/Register/Register'
import ConfirmRegister from '../../forms/ConfirmRegister/ConfirmRegister'
import FirstPage from '../../containers/FirstPage/FirstPage'
import UserAccount from '../UserAccount/UserAccount'


class Router extends Component {
    
    render () {
        return (
                this.props.jwt ? (
                <div>
                    <Switch>
                        <Route path = '/playGame' exact component = {DeckBuilder}/>
                        <Route path = '/login' exact component = {Login}/>
                        <Route path = '/register' exact component = {Register}/>
                        <Route path = '/confirmRegister/:code' component = {ConfirmRegister}/>
                        <Route path ='/user' component = {UserAccount}/>
                        <Route path ='/' exact component = {FirstPage}/>
                    </Switch>
                </div>) :( 
                    <Switch>
                        <Route path = '/confirmRegister/:code'  component = {ConfirmRegister}/>
                        <Route path = '/register'  component = {Register}/>                        
                        <Route path='/login'  component = {Login}/>
                        <Route path ='/'  component = {FirstPage}/>
                    </Switch>
                )
        )
    }
}

const mapStateToProps = state => {
    return {
        jwt : state.jwt,
        userId: state.userId,
        createdAt: state.createdAt,
        expiresAt: state.expiresAt
    }
}
export default connect(mapStateToProps)(Router);