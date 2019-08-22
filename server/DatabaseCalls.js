const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer')
const ObjectId = require('mongodb').ObjectId;
const oneDay = 60*60*24*1000;

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

login = (app) => {
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
}
register = (app) => {
    app.post('/register', async (req,res) => {
        let stop = 0;
        const body =JSON.parse(req.body.body)
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
            "gamesLost" : 0,
            "coins" : 5000
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
    
}
confirmRegister = (app) => {
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
}
user = (app) => {
    app.post('/user',(req,res) =>{
        const collection = req.app.locals.collection;
        const id = new ObjectId(req.body.userId)
        collection.findOne({_id: id})
            .then(response => {
                res.send(response)
            })
            .catch(error => console.log(error))
    })
}
deleteUser = (app) => {

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
}
gameWon = (app) => {
    app.post('/game/gameWon',(req,res) => {
        const collection = req.app.locals.collection;
        const id= new ObjectId(req.body.userId);
        collection.findOne({_id: id})
            .then(response => {
                const oldGameWon = response.gamesWon;
                const oldCoins = response.coins;
                console.log(req.body.decision)
                collection.update({_id:id},
                    {$set : {gamesWon: oldGameWon + 1, coins: oldCoins + req.body.decision.winAmountXBet*req.body.decision.bet}})
                res.send("ok!")
            })
            .catch(error => console.log(error))
    })
}
gameLost = (app) => {
    app.post('/game/gameLost',(req,res) => {
        const collection = req.app.locals.collection;
        const id= new ObjectId(req.body.userId);
        collection.findOne({_id: id})
            .then(response => {
                const oldGameLost = response.gamesLost;
                const oldCoins = response.coins;
                collection.update({_id:id},
                    {$set : {gamesLost: oldGameLost + 1}})
                res.send("ok!")
            })
            .catch(error => console.log(error))
    })
}
module.exports = {
    login: login,
    register: register,
    confirmRegister: confirmRegister,
    user:user,
    deleteUser:deleteUser,
    gameWon:gameWon,
    gameLost:gameLost
}