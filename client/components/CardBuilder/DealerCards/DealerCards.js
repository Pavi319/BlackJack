import React, {Component} from 'react'

import classes from './DealerCards.css';

class PlayerCard extends Component{
    render(){
        console.log(this.props)
        return ( (this.props.index !== 2) ?
            (<div
            className={classes.theCard}
            style={{
                backgroundPositionX: this.props.imageX,
                backgroundPositionY: this.props.imageY,
                marginLeft: this.props.marginLeft
                }}> 
            </div>) : ( 
                (this.props.flip !== 'rotateY(180deg)') 
                ? (
                <div className = {classes.mainContainer}>
                    <div className={classes.secondCard}>
                        <div className ={classes.theFront}></div>
                        <div className ={classes.theBack}></div>
                    </div>
                </div>
                ) : (
                    <div className = {classes.mainContainer}>
                    <div className={classes.secondCard}
                    style= {{transform: this.props.flip,
                            marginLeft: '-340px',
                            }}>
                        <div className ={classes.theFront}></div>
                        <div className ={classes.theBack}
                        style={{backgroundPositionX: this.props.imageX,
                            backgroundPositionY: this.props.imageY}}></div>
                    </div>
                </div>
                    
                )
            )
        )
    }
}

export default PlayerCard;