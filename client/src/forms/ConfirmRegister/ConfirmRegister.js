import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class ComfirmRegister extends Component{
    state = {
        expiredCode: null
    }
    componentDidMount = () =>{
        axios.post("http://localhost:5000/confirmRegister/" + this.props.match.params.code)
        .then(response => {
            console.log(response.data.expiredCode)
            if(response.data.expiredCode === true){
                this.setState({
                    expiredCode: true
                })
            }
            else {
                this.setState({
                    expiredCode: false
                })
            }
        })
    }

    render(){
        let redirect = null
        console.log(this.state.expiredCode)
        if(this.state.expiredCode === false){
            redirect = <Redirect to = '/login'/>
        }
        return (
            <div>
                {redirect}
            </div>
        )
    }
}

export default ComfirmRegister;