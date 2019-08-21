const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;

let playerAce=false;
let dealerAce = false;
let splitCase = false;
let cardsInPlay = 0;
let cardsUsed = [];

let newDeck = [];
const signs = ["Spades","Hearts",  "Diamonds", "Clubs"];
const values = ["Ace", "Two", "Three", "Four",  "Five","Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen","King"];
let cardScore=0;
const imageX=-17;
const imageY=-17;
for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < signs.length; j++) {
        if(i===0)
        {
            cardScore=11;
        }
        else
        {
            if(i>=9)
                cardScore=10;
            else
            {
                cardScore=i+1;
            }
        }
        newDeck.push({
            value : values[i],
            sign : signs[j],
            score: cardScore,
            imageX: imageX + i*(-229),
            imageY: imageY + j*(-334)
        })
        // if(cardsInPlay === 0){
        //     cardsInPlay = Math.floor(Math.random() * (newDeck.length / 2))
        // }
        for(let i=0;i<newDeck.length;i++)
        {
            let rand = Math.floor(Math.random() * newDeck.length);
            let swapAux = newDeck[i];
            newDeck[i]=newDeck[rand];
            newDeck[rand] = swapAux;
        }
    }
}
playGame = (app) => {app.get('/playGame',verifyToken,(req,res) => {
    const collection = req.app.locals.collection;
    var decoded = jwt.verify(req.token,'secretKey')
    const id= new ObjectId(decoded.response._id);
    collection.findOne({_id:id})
    .then (response => {
        res.send({
            playingDeck : newDeck,
            visibility: verifyCoinsHandler(response.coins),
            // cardsTillRe
        })
    })
    .catch(err => {
        return res.send(err)
    })        
}
)}
startGame = (app) => {
app.post('/startGame',verifyToken,(req,res) => {
    const playDeck = req.body.cardsDeck;
    let newPlayerCards = []
    newPlayerCards = playDeck
    let newPlayerScore = 0; 
    let newDealerScore = 0;
    let newDealerCards= [];
    let playerCards = [];
    let dealerCards = [];

    console.log(req.body)
    const firstPlayerCard = newPlayerCards.pop()
    playerCards.push(firstPlayerCard);
    const secondPlayerCard = newPlayerCards.pop()
    playerCards.push(secondPlayerCard);
    if(firstPlayerCard.value === 'Ace' || secondPlayerCard === 'Ace'){
        playerAce = true;
    }
    playerCards.forEach(card => {
        newPlayerScore+=card.score;
    })

    if(firstPlayerCard.value === secondPlayerCard.value){
        splitCase = true;
    }
    newDealerCards = [...newPlayerCards];
    const firstDealerCard = newDealerCards.pop()
    dealerCards.push(firstDealerCard);
    const secondDealerCard = newDealerCards.pop()
    dealerCards.push(secondDealerCard);
    if(firstDealerCard.value === 'Ace' || secondDealerCard === 'Ace'){
        dealerAce = true;
    }
    dealerCards.forEach(card => {
        newDealerScore+=card.score;
    })


    const collection = req.app.locals.collection;
    const bet = req.body.bet
    var decoded = jwt.verify(req.token,'secretKey')
    const id= new ObjectId(decoded.response._id);
    collection.findOne({_id:id})
    .then(response => {
            const oldCoins = response.coins;
            collection.update({_id:id},
            {$set : {coins: oldCoins - bet}})
    })

    res.send({
        playingDeck: newDealerCards,
        playerCards: playerCards,
        dealerCards: dealerCards,
        playerScore: newPlayerScore,
        dealerScore: newDealerScore,
        splitCase: splitCase
    })
    
})
}
addCard = (app) => {
    app.post('/addCard',(req,res) => {
        const body = req.body;
        let playerCards = [...body.playCards.playerCards]
        let deck = [...body.cardsDeck];
        let playerScore = body.playScore.playerScore;
        const newCard = deck.pop();
        playerScore +=newCard.score;
        playerCards.push(newCard);
        if(newCard.value === 'Ace'){
            playerAce = true;
        }
        if(playerAce === true && playerScore > 21){
            playerScore -=10
            playerAce = false;
        }
        res.send({
            cardsDeck : deck,
            playerCards : playerCards,
            playerScore: playerScore
        })
    })
}

stopGame = (app) => {
    app.post('/stopGame', (req,res) => {
        let newCards = [];
        const body = req.body;
        let deck = [...body.cardsDeck]
        let oldScore = body.playScore.dealerScore;
        let oldCards = [...body.playCards.dealerCards];
        while(oldScore <= body.playScore.playerScore){
            newCards.push(deck.pop())
            oldScore += newCards[newCards.length-1].score;
            if(newCards[newCards.length-1].value === 'Ace'){
                dealerAce = true
            }
            if(oldScore > 21 && dealerAce === true){
                oldScore -= 10;
                dealerAce = false;
            }         
        }
        newCards.forEach(card => {
            oldCards.push(card);            
        });
       
        res.send({
            cardsDeck : deck,
            dealerCards : oldCards,
            dealerScore: oldScore
        })
    })    
}

newGame = (app) => {
    app.post('/newGame',verifyToken, (req,res) => {
        playerAce = dealerAce = splitCase = false;
        let usedCards= [];
        const body = req.body;
        let remainingCards = [...body.cardsDeck];
        let playerCards = [...body.playCards.playerCards]
        let dealerCards = [...body.playCards.dealerCards];
        playerCards.forEach(card => {
            usedCards.push(card);
        })
        dealerCards.forEach(card => {
            usedCards.push(card);
        })
        usedCards.forEach(card => {
            remainingCards.push(card)
        })
        for(let i=0;i<remainingCards.length;i++)
        {
            let rand = Math.floor(Math.random() * remainingCards.length);
            let swapAux = remainingCards[i];
            remainingCards[i]=remainingCards[rand];
            remainingCards[rand] = swapAux;
        }
        const collection = req.app.locals.collection;
        var decoded = jwt.verify(req.token,'secretKey')
        const id= new ObjectId(decoded.response._id);
        collection.findOne({_id:id})
        .then(response => {
            res.send({
                visibility:verifyCoinsHandler(response.coins),
                cardsDeck : remainingCards
            })
        })
    })
}

function verifyToken (req,res,next){
    const bearerHeader = req.headers.authorization;
    if(typeof bearerHeader !== 'undefined'){
        console.log('aici!')
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else {
        res.sendStatus(403)
    }
}
module.exports = { 
    playGame : playGame,
    startGame: startGame,
    addCard: addCard,
    stopGame: stopGame,
    newGame: newGame
}