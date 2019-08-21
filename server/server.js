const express = require('express');
const bodyParser =require('body-parser');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const playGame = require('./PlayGameCalls')
const database = require('./DatabaseCalls')
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


database.login(app);
database.register(app);
database.confirmRegister(app);

playGame.playGame(app);

verifyCoinsHandler =(verifyAmount) => {
    let visibility = []
    if(verifyAmount < 50){
        visibility= ['hidden','hidden','hidden','hidden']
    }
    else if (verifyAmount < 100){
        visibility= ['visible','hidden','hidden','hidden']
    }
    else if (verifyAmount < 500){
        visibility= ['visible','visible','hidden','hidden']
    }
    else if (verifyAmount < 1000){
        visibility= ['visible','visible','visible','hidden']
    }
    else {
        visibility= ['visible','visible','visible','visible']
    }
    return visibility;
}
app.get('/verifyCoins',(req,res)=> {
    const collection = req.app.locals.collection;
    const id= new ObjectId(req.headers.userid);
    collection.findOne({_id:id})
    .then(response => {
        const verifyAmount = response.coins - req.headers.betamount;
        console.log(verifyAmount)
        res.send({
            visibility:verifyCoinsHandler(verifyAmount)
    })
    })
})

app.use(verifyToken,(req,res,next) => {
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
database.user(app)
database.deleteUser(app)
database.gameWon(app)
database.gameLost(app)

playGame.startGame(app)
playGame.addCard(app)
playGame.stopGame(app)
playGame.newGame(app)

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
