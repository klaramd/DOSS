
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var config = require('../config');
var dbPromise = require('../db');

//All post and gets
//So essentially GET is used to retrieve remote data, and POST is used to insert/update remote data

/* GET home page with the session */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'My TD platform',
        text: 'This helps to track your body and activites'

    });
    console.log(req.session);
});


//accountRouter.post
//User Account - get credentials
router.post('/account/submit', async function(req,res,next){

    if(req.body.username && req.body.userpw){
        //Find the user with those credentials in the database and fetch aslo the pw for hte password check
        try{
            var userQuery = await dbPromise.User.findOne({
                attributes: ['id', 'pw'],
                where: {
                    userName: req.body.username
                }
            })
            //compare the plain password with the hash ones
            const passwordCheck = await bcrypt.compare(req.body.userpw, userQuery.dataValues.pw);

            if(passwordCheck){
                req.session.isLoggedIn = true;
                req.session.userId = userQuery.dataValues.id;
                console.log(req.session.userId);
                res.redirect('/useraccount/' + req.session.userId);}

        } catch(error){
            console.log(error);
            res.render('account');
        };

    };

});

//Get the id
router.get('/useraccount/:id', function(req, res,next){
    res.render('useraccount', {output: req.params.id});

});

//statisticsRouter.post
//Getting new trainings input
router.post('/useraccount/submittraining', async function(req,res,next){
    //var currentID = req.params.id;
    await dbPromise.Training.create({
        userId: req.session.userId,
        startDate: req.body.startdate,
        startTime: req.body.starttime,
        endDate: req.body.enddate,
        endTime: req.body.endtime,
        description: req.body.details
    })
    /* DISPLAYING SHIZZLE
     const trainingtest = await dbPromise.User.findById(2, {include: [dbPromise.Training]})
     console.log(trainingtest.trainings.map(t => t.description))
     */
    res.redirect('/useraccount/' );
});

//Getting new weight input
router.post('/useraccount/submitweight', async function(req,res,next){
    // var currentID = req.params.id;
    await dbPromise.Weight.create({
        userId: req.session.userId,
        weightDate: req.body.weightdate,
        weightKG: req.body.weightkg
    })

    /*DISPLAYING SHIZZLE
     const test = await dbPromise.User.findById(2, {include: [dbPromise.Weight] })
     //console.log(test.weights)
     console.log(test.weights.map(w => w.weightKG))
     */
    res.redirect('/useraccount/');
});


//Register credentials
//https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
router.post('/register/submit', async function(req,res,next){
    console.log("Post method triggered");

    //hash const for hashing the password and await since it has to work with the async
    const hash = await bcrypt.hash(req.body.regpw, 10);

    const newUser = await dbPromise.User.create({
        userName: req.body.regname,
        pw: hash,
        city: req.body.city,
        birthday: req.body.birthday
    });
    console.log(newUser.dataValues.id);

    res.redirect('/register');
});
//https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52

//Contact infos
router.post('/contact/submit', function(req,res,next){
    var newContact = {
        contactemail: req.body.contactemail,
        contactreference: req.body.contactreference,
        contactmes: req.body.contactmes
    };
    res.redirect('/contact');
    console.log(newContact);
});


//Logout
//Can't destroy it since action thingy works only with forms
router.post('/logout', function(req,res,next){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
    //console.log(session);
})

/****************** REST API STUFF ***********/

router.post('/api/login', async function(req,res,next){
    if(req.body.username && req.body.userpw) {
        //Find the user with those credentials in the database and fetch aslo the pw for hte password check
        console.log(req.body.username);
        var userQuery = await dbPromise.User.findOne({
            attributes: ['id', 'pw'],
            where: {
                userName: req.body.username
            }
        })

       // if (err) return res.status(500).send("Error");
        if (!userQuery) return res.status(404).send("No user found");
        var passwordCheckApi = bcrypt.compare(req.body.userpw, userQuery.dataValues.pw);
        if (!passwordCheckApi) return res.status(401).send({auth: false, token: null}, "Wrong password");

        //username as well
        console.log(userQuery.dataValues.userName);
        var usertoken = jwt.sign({id: userQuery.dataValues.id}, config.secret, {expiresIn: 86400});
        //create an access token   - jwt.verify to parse it back
       // var accesstoken = jwt.sign
        console.log(usertoken);
        res.status(200).send({auth: true, token: usertoken})

    } else {
        res.status(400).send("Errorrr");
    }
});



module.exports = router;
//module.exports = {'secret': 'supersecret'};


