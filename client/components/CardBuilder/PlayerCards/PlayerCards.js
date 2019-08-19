import React, {Component} from 'react'

import classes from './PlayerCards.css';

class PlayerCard extends Component{
    render(){
        return (
            <div
            className={classes.theCard}
            style={{
                backgroundPositionX: this.props.imageX,
                backgroundPositionY: this.props.imageY,
                marginLeft: this.props.marginLeft
                }}> 
            </div>
        )
    }
}

export default PlayerCard;