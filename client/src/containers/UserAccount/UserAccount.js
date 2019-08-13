import React,{Component} from 'react'
import axios from 'axios';
import {connect} from 'react-redux'
import api from '../../hoc/Calls'
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie'

import classes from './UserAccount.css'

class UserAccount extends Component {
    state = {
        username: '',
        dateJoined: '',
        gamesWon: '',
        gamesLost: '',
        redirect: false,
        coins: null
    }
    componentDidMount = () => {
        let request = {
            method: 'POST',
            url: api.user,
            headers : {
                'Content-Type': 'application/json',
                'Authorization' :'Bearer ' + this.props.jwt
            },
            data: this.props
        }
        console.log(request.data)
        axios(request)
        .then(response => {
            console.log(response);
            this.setState({
                username : response.data.username,
                dateJoined : response.data.registerCodeDate.split('T')[0],
                gamesLost : response.data.gamesLost,
                gamesWon : response.data.gamesWon,
                coins: response.data.coins
            })
            console.log(this.state.dateJoined)
        })
    }
    userDeleteHandler = () => {
        let request = {
            method: 'POST',
            url: api.delete,
            headers : {
                'Content-Type': 'application/json',
                'Authorization' :'Bearer ' + this.props.jwt
            },
            data: this.props
        }
        axios(request)
        .then(response => {
            this.setState({redirect: true})
            const cookies = new Cookies();
            cookies.remove('jwt'); 
            cookies.remove('createdAt');
            cookies.remove('expiresAt');
            cookies.remove('userId');
        })
    }
    render(){
        let maybeRedirect = (
            <div className= {classes.Box}>
                <div className= {classes.Area}>
                    <p>Username: {this.state.username}</p>
                </div>
                <div className= {classes.Area}>
                    <p>Date joined: {this.state.dateJoined}</p>
                </div>
                <div className= {classes.Area}>
                    <p>Games Won: {this.state.gamesWon}</p>
                </div>
                <div className= {classes.Area}>
                    <p>Games Lost: {this.state.gamesLost}</p>
                </div>
                <div className= {classes.Area}>
                    <p>Coins: {this.state.coins}</p>
                </div>
                <button type= 'submit' onClick= {this.userDeleteHandler}>Delete Account</button>
            </div>
        )
        console.log(this.state.redirect)
        if(this.state.redirect === true ){
            maybeRedirect = <Redirect to = {'/login'}/>
        }
        return (
            <div>
                {maybeRedirect}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        jwt : state.jwt,
        userId: state.userId,
    }
}
export default connect(mapStateToProps)(UserAccount);