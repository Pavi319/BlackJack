import React,{Component} from 'react'
import Aux from '../../hoc/Auxiliary'
import CardBuilder from '../../components/CardBuilder/CardBuilder';
import Controller from '../../components/Controller/Controller'
import GameDecision from '../../components/GameDecision/GameDecision'
import { withRouter } from "react-router";
import {Redirect} from 'react-router-dom'
import axios from 'axios';
import api from '../../hoc/Calls'
import {connect} from 'react-redux'
import Cookies from 'universal-cookie'

class DeckBuilder extends Component{
    showScore = false; 
    state={
        cardsDeck: [],
        playCards: {
            playerCards: [],
            dealerCards: []
        },
        playScore: {
            playerScore: 0,
            dealerScore: 0
        },
        disabledButtons: [true,true,true,true],
        show: true,
        playerAce: false,
        dealerAce: false,
        flip : 'rotateY(0deg)',
        chipsVisibility:[],
        showPlayer: false,
        showDealer : false,
        bet: 0,
        winAmountXBet: 2
    }
    componentDidMount = async () => {
        let request = {
            url: api.playGame,
            method: 'GET',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' :'Bearer ' + this.props.jwt,
                'userid' : this.props.userId
            },
        }
        await axios(request)
        .then( response => {
            this.setState({
                bet: this.props.bet,
                cardsDeck : response.data.playingDeck,
            })
            this.props.saveAccountCoins(response.data.coins)
        })
        .catch(err => {
            console.log(err)
        })
        axios.interceptors.request.use((config) => {
            console.log(config);
            return config;
        },(error) => {
            console.log('error');
            return Promise.reject(error);
        })
        axios.interceptors.response.use((config) => {
            console.log(config)
            return config;
        },(error) => {
            this.setState({show: false})
            const cookies = new Cookies();
            cookies.remove('jwt');
            cookies.remove('createdAt');
            cookies.remove('expiresAt');
            cookies.remove('userId');
            return Promise.reject(error);
        })
        console.log(this.props.coins)
        this.verifyCoinsVisibility(this.props.coins)
    }
    
    startGameHandler = async () => {
        let request = {
            method: 'POST',
            url: api.startGame,
            headers : {
                'Content-Type': 'application/json',
                'Authorization' :'Bearer ' + this.props.jwt,
                'UserId' : this.props.userId
            },
            data: this.state
        };
        console.log(request.headers)
        axios(request)
        .then(response => {
            console.log(response.data)
            this.setState({
                cardsDeck: response.data.playingDeck,
                playCards : {
                    playerCards : response.data.playerCards,
                    dealerCards : response.data.dealerCards
                },
                playScore: {
                    playerScore: response.data.playerScore,
                    dealerScore: response.data.dealerScore
                },
                disabledButtons: [true,false,false,true],
                chipsVisibility: ['hidden','hidden','hidden','hidden'],
                showPlayer: true,
            })
        })
        .catch(err => {
            console.log(err)
        })
        if(this.state.playScore['playerScore'] === 21  ){
            this.setState({
                disabledButtons: [true,true,true,false],
                winAmountXBet: 2.2
            })
        }
      }
    addCardHandler = async () => {  
        let request = {
            url: api.addCard,
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' :'Bearer ' + this.props.jwt,
            },
            data: this.state,
        }
        axios(request)
        .then(response => {
            console.log(response)
            if(response.data.playerScore<21){
                this.setState({
                    cardsDeck: response.data.cardsDeck,
                    playCards: {
                        playerCards : response.data.playerCards,
                        dealerCards : this.state.playCards['dealerCards']
                    },
                    playScore: {
                        playerScore: response.data.playerScore,
                        dealerScore: this.state.playScore['dealerScore']
                    }
                })
            }
            else{
                this.setState({
                    cardsDeck: response.data.cardsDeck,
                    playCards: {
                        playerCards : response.data.playerCards,
                        dealerCards : this.state.playCards['dealerCards']
                    },
                    playScore: {
                        playerScore: response.data.playerScore,                    
                        dealerScore: this.state.playScore['dealerScore']
                    },
                    disabledButtons: [true,true,true,false]
                })
                this.showScore = true;
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
    newGameHandler = () => {
        this.showScore = true;
        let request = {
            url: api.newGame,
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' :'Bearer ' + this.props.jwt,
                'userid' : this.props.userId
            },
            data: this.state,
        }
        axios(request)
        .then(response => {
            console.log(response)
            this.setState({
                cardsDeck: response.data.cardsDeck,
                playCards : {
                    playerCards : [],
                    dealerCards : []
                    },
                playScore: {
                        playerScore: 0,
                        dealerScore: 0
                    },
                disabledButtons: [true,true,true,true],
                flip: 'rotateY(0deg)',
                showPlayer: false,
                showDealer: false,
                bet:0
            })
            console.log(response.data.coins)
        this.props.saveAccountCoins(response.data.coins)
        this.props.saveBetValue(0)
        this.verifyCoinsVisibility(response.data.coins)
    })
        this.showScore = false;
    }
    stopGameHandler =async () => {
        let request = {
            url:api.stopGame,
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' :'Bearer ' + this.props.jwt,
            },
            data: this.state,
        }
        axios(request)
        .then(response => {
            this.setState({
                cardsDeck : response.data.cardsDeck,
                playCards: {
                    playerCards : this.state.playCards['playerCards'],
                    dealerCards : response.data.dealerCards
                },
                playScore: {
                    playerScore: this.state.playScore['playerScore'],
                    dealerScore: response.data.dealerScore
                },
                disabledButtons: [true,true,true,false],
                flip: 'rotateY(180deg)',
                showDealer: true
            })
        })
        this.showScore = true;        
    }
    verifyCoinsVisibility = (betAmount) => {
        const visibility = betAmount/50;
        if(visibility < 1){
            this.setState({chipsVisibility: ["hidden","hidden","hidden","hidden"]})
        }
        else if(visibility <2){
            this.setState({chipsVisibility: ["visible","hidden","hidden","hidden"]})
        }
        else if(visibility <10){
            this.setState({chipsVisibility: ["visible","visible","hidden","hidden"]})
        }
        else if(visibility <20){
            this.setState({chipsVisibility: ["visible","visible","visible","hidden"]})
        } else {
            this.setState({chipsVisibility: ["visible","visible","visible","visible"]})
        }
        console.log(this.state.chipsVisibility)
    }
    addBetHandler = (betAmount) => {
        let oldBet = this.props.bet;
        oldBet +=betAmount
        console.log(oldBet)
        this.verifyCoinsVisibility(this.props.coins-oldBet)
        this.setState({
            disabledButtons: [false,true,true,true],
        })
        this.props.saveBetValue(oldBet)
        this.setState({
            bet: oldBet
        })
    }
    refreshBetHandler = () => {
        this.setState({
            disabledButtons: [true,true,true,true],
        })
        this.props.saveBetValue(0)
        this.verifyCoinsVisibility(this.props.coins)
        this.setState({
            bet: 0
        })
    }
    render(){
        let showOrRedirect = (
            <Aux>
                <CardBuilder
                    playingCards={this.state.playCards}
                    flip = {this.state.flip}
                />
                <Controller
                    cardAdded={this.addCardHandler}
                    startGame={this.startGameHandler}
                    stopGame={this.stopGameHandler}
                    newGame= {this.newGameHandler}
                    disabledButtons={this.state.disabledButtons}
                    score={this.state.playScore}
                    betMoney = {this.addBetHandler}
                    visible = {this.state.chipsVisibility}
                    refreshBet = {this.refreshBetHandler}
                    showDealer = {this.state.showDealer}
                    showPlayer = {this.state.showPlayer}
                />
                <GameDecision
                    decision={this.state}
                    showScore={this.showScore}
                    userId={this.props.userId}
                    jwt = {this.props.jwt}/>
            </Aux>
        )
        const cookies = new Cookies();
        if(this.state.show === false || !this.props.jwt ){
            showOrRedirect = <Redirect to = {'/login'} />
        }
            return(
                <Aux>    
                    {showOrRedirect}
                </Aux>
            )
    }
} 
const mapStateToProps = state => {
    return {
        jwt : state.jwt,
        userId: state.userId,
        coins: state.coins,
        bet: state.bet
    }
}
const mapDispatchToProps = dispatch => {
    return {
        saveAccountCoins : (coins) => dispatch({type: 'SAVE_COINS',coins: coins}),
        saveBetValue : (bet) => dispatch({type: 'SAVE_BET',bet: bet})
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(DeckBuilder));
