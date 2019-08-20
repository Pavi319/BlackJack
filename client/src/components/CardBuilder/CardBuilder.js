import React from 'react'

import Aux from '../../hoc/Auxiliary'
import PlayerCard from './PlayerCards/PlayerCards'
import DealerCard from './DealerCards/DealerCards'

import classes from './CardBuilder.css'

const cardBuilder = (props) => {
        let playerCards ;
        let playerCount = 0;
        playerCards = Object.keys(props.playingCards['playerCards'])
            .map(cKey => {
                playerCount++;
                return [...Array(props.playingCards['playerCards'][cKey])].map((card,i) => {
                    return <PlayerCard imageX={card.imageX} imageY= {card.imageY} key={cKey + i} marginLeft = {playerCount * 30} />
                })
        })
        .reduce((arr,el) => {
            return arr.concat(el);
        },[]);
    // else {

    // }
    let dealerCount = 0; 
    let dealerCards = Object.keys(props.playingCards['dealerCards'])
        .map(cKey => {
            dealerCount++;
            return [...Array(props.playingCards['dealerCards'][cKey])].map((card,i) => {
                return <DealerCard imageX={card.imageX} imageY= {card.imageY} key={cKey + i} marginLeft = {dealerCount * 30} index = {dealerCount} flip = {props.flip}/>
            })
    })
    .reduce((arr,el) => {
        return arr.concat(el);
    },[]);
    return(
        <Aux>
            <div className={classes.PlayerCardsContainer}>
            {playerCards}
            </div>
            <div>
            {dealerCards}
            </div>
        </Aux>
    )
}

export default cardBuilder