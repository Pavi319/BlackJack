import React from 'react'

import classes from './Controller.css'
import Aux from '../../hoc/Auxiliary'
const controller = (props) => (
    <Aux >
        <div className={classes.ButtonContainer}>
            <button 
            value={'Start Game!'}
            onClick={() => props.startGame()}
            disabled={props.disabledButtons[0]}
            >Start Game!</button>
            <button 
            value={'Hit!'}
            onClick={() => props.cardAdded()}
            disabled={props.disabledButtons[1]}
            >Hit!</button>
            <button 
            value={'Stop!'}
            onClick={() => props.stopGame()}
            disabled={props.disabledButtons[2]}
            >Stop!</button>
            <button 
            value={'New Game!'}
            onClick={() => props.newGame()}
            disabled={props.disabledButtons[3]}
            >New Game!</button>
            {
                (props.splitCase) ? 
                (<button>Split!</button>) : null
            }
        </div>
        <div className={classes.BetButtonContainer}>
            <p className = {classes.TotalBet}>Total bet:{props.bet}</p>
            <button className={classes.Chip}
                onClick = {() => props.betMoney(50)}
                style={{backgroundPosition: '933px -371px',
                borderRadius: '50%',
                visibility:  props.visible[0]}}>
            </button>
            <button className={classes.Chip}
                onClick = {() => props.betMoney(100)}
                style={{backgroundPosition: '-461px -372px',
                borderRadius: '50%',
                visibility:  props.visible[1]}}>
            </button>
            <button className={classes.Chip}
                onClick = {() => props.betMoney(500)}
                style={{backgroundPosition: '-461px -586px',
                borderRadius: '50%',
                visibility:  props.visible[2]}}>
            </button>
            <button className={classes.Chip}
                onClick = {() => props.betMoney(1000)}
                style={{backgroundPosition: '-635px -587px',
                borderRadius: '50%',
                visibility: props.visible[3]}}>
            </button>
        </div>
        <div className = {classes.PContainer}>
            {(props.showPlayer) ? (<p>Player points:<strong>{props.score['playerScore']}</strong></p>) : null }
            {
                (props.showDealer) ? 
                ( <p>Dealer points: <strong>{props.score['dealerScore']}</strong></p> )
                : null
            }
        </div>
    </Aux>
)

export default controller;