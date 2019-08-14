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
        bet: 0,
        chipsVisibility:[]
    }
    componentDidMount = async () => {
        // console.log('aici')
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
                cardsDeck : response.data.playingDeck,
                chipsVisibility: response.data.visibility
            })
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
            data: this.state,
        };
        console.log(request.headers)
        axios(request)
        .then(response => {
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
                chipsVisibility: 'hidden'
            })
        })
        .catch(err => {
            console.log(err)
        })
        if(this.state.playScore['dealerScore'] === 21 || this.state.playScore['playerScore'] === 21  ){
            this.setState({
                disabledButtons: [true,true,true,false]
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
    newGameHandler =async () => {
        this.showScore = true;
        let request = {
            url: api.newGame,
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' :'Bearer ' + this.props.jwt
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
                bet: 0,
                chipsVisibility: 'visible'
            })
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
                flip: 'rotateY(180deg)'
            })
        })
        this.showScore = true;        
    }
    addBetHandler = (betAmount) => {
        let oldBet = this.state.bet;
        oldBet +=betAmount
        let request = {
            url: api.verifyCoins,
            method: 'GET',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' :'Bearer ' + this.props.jwt,
                'userid' : this.props.userId,
                'betAmount' : oldBet
            },
        }
        axios(request)
        .then(response => {
            console.log(response)
            this.setState({
                bet : oldBet,
                disabledButtons: [false,true,true,true],
                chipsVisibility : response.data.visibility
            })
        })
        
       
        console.log(oldBet);
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
                    bet={this.state.bet}
                    visible = {this.state.chipsVisibility}
                />
                <GameDecision
                    decision={this.state}
                    showScore={this.showScore}
                    userId={this.props.userId}
                    jwt = {this.props.jwt}
                    bet = {this.props.bet}/>
            </Aux>
        )
        const cookies = new Cookies();
        if(this.state.show === false || !cookies.get('jwt') ){
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
    }
}
export default connect(mapStateToProps)(withRouter(DeckBuilder));