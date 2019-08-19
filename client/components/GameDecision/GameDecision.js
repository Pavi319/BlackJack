import React,{Component} from 'react'
import axios from 'axios';
import Aux from '../../hoc/Auxiliary'
import api from '../../hoc/Calls'
class GameDecision extends Component {
    state= {
        winner: null
    }
    modifyScore = () => {
         let request = {
            url:api.decision ,
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' :'Bearer ' + this.props.jwt
            },
            data: this.props
        }
        console.log(this.props)
        if(this.props.decision.playScore['playerScore'] === 21 || this.props.decision.playScore['dealerScore'] > 21){
            this.state.winner= 'Player'
            request.url += '/gameWon';
            axios(request)        
        }
        else{
            this.state.winner='Dealer'
            request.url += '/gameLost';
            axios(request)
        }
    }
    render(){
        return (
            <Aux>
            {   (this.props.decision.playScore['playerScore'] >=21 || this.props.decision.playScore['dealerScore'] >= 21 || this.props.showScore === true) ?
                (<div>
                {   this.modifyScore

                    (this.props.decision.playScore['playerScore'] === 21 || this.props.decision.playScore['dealerScore'] > 21) ?
                    (<div>
                        <p>{this.state.winner} has won the game!</p>
                    </div>
                    ) : (<p>{this.state.winner} has won the game!</p>)
                }
                </div>) : null
            }
           
            </Aux>
        )
    }
}

export default (GameDecision);