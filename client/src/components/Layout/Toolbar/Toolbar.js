import React,{Component} from 'react';
import logo from '../../../assets/logo.jpg'
import { withRouter, Redirect } from 'react-router-dom';
import {connect} from 'react-redux'
import Cookies from 'universal-cookie';

import classes from './Toolbar.css'

class Toolbar extends Component{
    state= {
        goTo: null
    }

    componentDidMount = () => {
        console.log(this.props)

    }
    profileHandler = async () => {
        await this.setState({
            goTo: 'user'
        })
    }
    
    playGameHandler = async () => {
        await this.setState({
            goTo: 'playGame'
        })
    }
    // logOutHandler = async () => {
    //     const cookies = new Cookies();
    //     cookies.remove('jwt');
    //     cookies.remove('createdAt');
    //     cookies.remove('expiresAt');
    //     cookies.remove('userId');
    //     this.setState({goTo: 'login'})
    // }
    render(){
        let redirect= null;
        if(this.state.goTo != null){
            redirect = <Redirect to ={`/${this.state.goTo}`}/>
        }
        let cookies = new Cookies()
        if(!this.props.jwt ||  cookies.get('jwt')=== undefined){
            redirect = null;
        }
        return(
            <div className={classes.Toolbar}>
                    {redirect}
                    <button type="button" onClick={this.profileHandler} >Profile</button>                
                    {/* <button type= "button" onClick={this.logOutHandler}>Logout</button> */}
                    <img src={logo} className={classes.Logo} />
                    <button type="button" onClick={this.playGameHandler} alt="">Play Game</button>
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
export default connect(mapStateToProps)(withRouter (Toolbar))