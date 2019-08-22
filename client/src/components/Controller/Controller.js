import React,{Component} from 'react'
import {connect} from 'react-redux'

import classes from './Controller.css'
import Aux from '../../hoc/Auxiliary'
class Controller extends Component {
    render(){
        console.log(this.props.bet);
        return(
            <Aux >
                <div className={classes.ButtonContainer}>
                    <button 
                    value={'Start Game!'}
                    onClick={() => this.props.startGame()}
                    disabled={this.props.disabledButtons[0]}
                    >Start Game!</button>
                    <button 
                    value={'Hit!'}
                    onClick={() => this.props.cardAdded()}
                    disabled={this.props.disabledButtons[1]}
                    >Hit!</button>
                    <button 
                    value={'Stop!'}
                    onClick={() => this.props.stopGame()}
                    disabled={this.props.disabledButtons[2]}
                    >Stop!</button>
                    <button 
                    value={'New Game!'}
                    onClick={() => this.props.newGame()}
                    disabled={this.props.disabledButtons[3]}
                    >New Game!</button>
                    {
                        (this.props.splitCase) ? 
                        (<button>Split!</button>) : null
                    }
                </div>
                <div className={classes.BetButtonContainer}>
                    <p className = {classes.TotalBet}>Total bet:{this.props.bet}</p>
                    <p>Coins: {this.props.coins}</p>
                    <button className={classes.Chip}
                        onClick = {() => this.props.betMoney(50)}
                        style={{backgroundPosition: '933px -371px',
                        borderRadius: '50%',
                        visibility:  this.props.visible[0]}}>
                    </button>
                    <button className={classes.Chip}
                        onClick = {() => this.props.betMoney(100)}
                        style={{backgroundPosition: '-461px -372px',
                        borderRadius: '50%',
                        visibility:  this.props.visible[1]}}>
                    </button>
                    <button className={classes.Chip}
                        onClick = {() => this.props.betMoney(500)}
                        style={{backgroundPosition: '-461px -586px',
                        borderRadius: '50%',
                        visibility:  this.props.visible[2]}}>
                    </button>
                    <button className={classes.Chip}
                        onClick = {() => this.props.betMoney(1000)}
                        style={{backgroundPosition: '-635px -587px',
                        borderRadius: '50%',
                        visibility: this.props.visible[3]}}>
                    </button>
                    {
                        (this.props.bet>0 && this.props.disabledButtons[0] === false) ? 
                        (<button onClick = {() => this.props.refreshBet()}>Refresh Bet!</button>) : null
                    }
                </div>
                <div className = {classes.PContainer}>
                    {(this.props.showPlayer) ? (<p>Player points:<strong>{this.props.score['playerScore']}</strong></p>) : null }
                    {
                        (this.props.showDealer) ? 
                        ( <p>Dealer points: <strong>{this.props.score['dealerScore']}</strong></p> )
                        : null
                    }
                </div>
            </Aux>
        )
    }
}
 
const mapStateToProps = state => {
    return {
        coins: state.coins,
        bet: state.bet
    }
}
export default connect(mapStateToProps)(Controller);