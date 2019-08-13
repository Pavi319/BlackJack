
const bodyParser =require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer')
const axios = require('axios'); 
const oneDay = 60*60*24*1000;
let playerAce=false;
let dealerAce = false;


app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}))
const port = 5000;
const database_url = 'mongodb://localhost:27017';

MongoClient.connect(database_url, {useNewUrlParser:true})
.then(client => {
    const db = client.db('BlackJack');
    const collection = db.collection('Users');
    app.locals.collection = collection;
    app.listen(port,() => console.log(`REST API running on port :${port}`));
}).catch(error => console.error(error));

registerCodeHandler = () => {
    const length = 48
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
app.post('/login', (req,res) => {
    const body =JSON.parse(req.body.body)
    const email=body.email;
    const pass = body.password;
    const collection = req.app.locals.collection;
    collection.findOne({email:email})
        .then(response => {
            if(bcrypt.compareSync(pass,response.password))
            {   
                if(response.confirmedRegistration === true){
                    jwt.sign({response}, 'secretKey',{expiresIn : '24h'},(err,token) => {
                        return res.send({
                            redirect: 'playGame',
                            unRegistered : false,
                            wrongCreditials: false,
                            id: response._id,
                            token: token,
                            createdAt: jwt.decode(token).iat,
                            expiresAt: jwt.decode(token).exp
                        });
                    })
                }
                else{
                    console.log(response)
                   return res.send({
                        redirect: 'login',
                        wrongCreditials: false,
                        unRegistered: true
                   })
                }
            }
            else {
                return res.send({
                    redirect: 'login',
                    wrongCreditials: true,
                    unRegistered : false 
                })
            }
            if(response.isDeleted === true){
                return res.send({
                    redirect: 'login',
                    wrongCreditials: false,
                    unRegistered: true
               })
            }
        })
        .catch(error => {
            console.log(error)
            return res.send({
                redirect: 'login',
                wrongCreditials: true,
                unRegistered : false 
            })
        });
})

app.post('/register', async (req,res) => {
    let stop = 0;
    const body =JSON.parse(req.body.body)
    // const body = req.body;
    // console.log(req.body)
    if(body.password != body.repeatedPassword){
        stop = 1;
    }
    let today=new Date();
    const newUser = {
        "username" : body.username.toLowerCase(),
        "email" : body.email,
        "password" : bcrypt.hashSync(body.password,10),
        "isDeleted" : false,
        "registerCode": registerCodeHandler(),
        "confirmedRegistration" : false,
        "registerCodeDate" : today,
        "gamesWon" : 0,
        "gamesLost" : 0
    }
    const collection = req.app.locals.collection;
    await collection.findOne({email:newUser.email})
    .then(response => {
        if(response != null){
            stop = 2;
        }
    })
    .catch(error => console.log(error))
    if(stop === 0){
        let transporter = nodeMailer.createTransport({
            host: 'mail.rms.ro',
            port: 465,
            secure: true,
            auth: {
                user: 'pav',
                pass : 'y3T8GChI'
            },
            debug: true,
            logger: true
        });
        collection.insertOne(newUser)
        .then(response =>{
            let mailOptions = {
                from : 'pav@rms.ro',
                to : newUser.email,
                subject: 'BlackJack Game!',
                html: '<p>Click <a href = "http://localhost:3000/confirmRegister/' + response.insertedId +'"> here </a>to confirm your email !</p>'
            };
            transporter.sendMail(mailOptions, (error,info) => {
                if(error) {
                    return console.log(error);
                }
    
                console.log('Message %s sent %s', info.messageId,info.response);
            });
            return res.send ({
                message: 'The account was successfully created! Verify your email!',
                alreadyExists : false,
                samePassword : false

            })
        })
        .catch(error => console.log(error))
    } else {
        if (stop === 1){
            res.send({
                samePassword: true,
                alreadyExists : false
            })
        } else {
            res.send ({
                samePassword: false,
                alreadyExists : true
            })
        }
    }
})

app.get('/playGame',(req,res) => {
    console.log(req)
    let newDeck = [];
    let signs = ["Spades","Hearts",  "Diamonds", "Clubs"];
    let values = ["Ace", "Two", "Three", "Four",  "Five","Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen","King"];
    let cardScore=0;
    let imageX=-17;
    let imageY=-17;
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
        }
    }
    for(let i=0;i<newDeck.length;i++)
    {
        let rand = Math.floor(Math.random() * newDeck.length);
        let swapAux = newDeck[i];
        newDeck[i]=newDeck[rand];
        newDeck[rand] = swapAux;
    }
    // console.log(JSON.stringify(newDeck))
    return res.send({
        playingDeck : newDeck
    })
})

app.post('/confirmRegister/:id/', async(req,res) => {
    const collection = req.app.locals.collection;
    const id= new ObjectId(req.params.id);
    const today= new Date()
    await collection.findOne({_id: id})
    .then( response =>  {
        console.log(today-response.registerCodeDate)
        if((today-response.registerCodeDate)>oneDay)
        {
            console.log('A expirat data!')
            return res.send({
                expiredCode: true
            })
        }
        else {
        console.log('Nu a expirat data!')
        collection.update({_id: id},
            {$set : {confirmedRegistration : true}}, false, true)
        collection.update({_id:id},
            {$unset: {registerCode:1}},false,true)
            return res.send({
                expiredCode: false
            })
        }
    })
    .catch(error => console.log(error))
})
app.use(verifyToken,(req,res,next) => {
    // console.log(req.data)
   if(req.method =='POST'){
       jwt.verify(req.token,'secretKey', (err) => {
           if(err){
               res.sendStatus(403);
           }
           else {
               next();
           }
       })
   }
})

app.post('/user',(req,res) =>{
    const collection = req.app.locals.collection;
    const id = new ObjectId(req.body.userId)
    collection.findOne({_id: id})
        .then(response => {
            res.send(response)
        })
        .catch(error => console.log(error))
})

app.post('/user/delete',(req,res) => {
    const collection = req.app.locals.collection;
    const id= new ObjectId(req.body.userId);
    collection.findOne({_id: id})
        .then(response => {
            collection.update({_id:id},
                {$set : {isDeleted: true}})
            res.send(response)
        })
        .catch(error => console.log(error))
})
app.post('/game/gameWon',(req,res) => {
    const collection = req.app.locals.collection;
    const id= new ObjectId(req.body.userId);
    console.log(req.body.decision.bet)
    collection.findOne({_id: id})
        .then(response => {
            const oldGameWon = response.gamesWon;
            const oldCoins = response.coins;
            collection.update({_id:id},
                {$set : {gamesWon: oldGameWon + 1, coins: oldCoins + 2*req.body.decision.bet}})
        })
        .catch(error => console.log(error))
})
app.post('/game/gameLost',(req,res) => {
    const collection = req.app.locals.collection;
    const id= new ObjectId(req.body.userId);
    collection.findOne({_id: id})
        .then(response => {
            const oldGameLost = response.gamesLost;
            const oldCoins = response.coins;
            collection.update({_id:id},
                {$set : {gamesLost: oldGameLost + 1}})
        })
        .catch(error => console.log(error))
})

app.post('/startGame',(req,res) => {
    const playDeck = req.body.cardsDeck;
    let newPlayerCards = []
    newPlayerCards = playDeck
    let newPlayerScore = 0; 
    let newDealerScore = 0;
    let newDealerCards= [];
    let playerCards = [];
    let dealerCards = [];


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
    const id = new ObjectId(req.headers.userid)
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
    })
    
})

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

app.post('/stopGame', (req,res) => {
    let newScore = 0;
    let newCards = [];
    const body = req.body;
    let deck = [...body.cardsDeck]
    let oldScore = body.playScore.dealerScore;
    let oldCards = [...body.playCards.dealerCards];
    while(oldScore + newScore <= body.playScore.playerScore){
        newCards.push(deck.pop())
        newScore += newCards[newCards.length-1].score;
        if(newCards[newCards.length-1].value === 'Ace'){
            dealerAce = true
        }         
    }
    newCards.forEach(card => {
        oldCards.push(card);            
    });
    oldScore+=newScore;
    if(oldScore > 21 && dealerAce === true){
        oldScore -= 10;
        dealerAce = false;
    }
    res.send({
        cardsDeck : deck,
        dealerCards : oldCards,
        dealerScore: oldScore
    })
})

app.post('/newGame', (req,res) => {
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
    res.send({
        cardsDeck : remainingCards
    })
})

function verifyToken (req,res,next){
    // console.log(req.data)
    const bearerHeader = req.headers.authorization;
    // console.log(bearerHeader)
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

