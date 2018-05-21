
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');



var config = require('../config');
var dbPromise = require('../db');

/* GET home page with the session */
router.get('/', function(req, res, next) {

    res.render('index', {
        title: 'My TD platform',
        text: 'This helps to track your body and activites',

    });
    console.log(req.session);
});


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
                res.redirect('/useraccount/' + req.session.userId);

            }

        } catch(error){
            console.log(error);
            res.render('account');
        };
    };
});


router.get('/useraccount/:id', function(req, res,next){
    res.render('useraccount', {
        output: req.params.id
       });

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


router.get('/communityuser/:id', async function(req, res){
    const id =  req.params.id
    const trainingDisplay = await dbPromise.Training.findAll({
        attributes: ['description', 'startDate', 'startTime', 'endTime'],
        where: {
            userId: id
        },
        order: [['updatedAt', 'DESC']]
    })

    var weightDisplay = await dbPromise.Weight.findAll({
        attributes: ['weightKG', 'weightDate', 'updatedAt'],
        where: {
            userId: req.params.id
        },
        order: [['updatedAt', 'DESC']]

    });

    const userDisplay = await dbPromise.User.findOne({
        attributes: ['userName'],
        where:{
            id: req.params.id
        }
    })
    res.render('communityuser', {trainingDisplay: trainingDisplay, weightDisplay: weightDisplay, user: userDisplay.valueOf().userName})
    console.log(userDisplay.valueOf().userName)
})


router.post('/logout', function(req,res,next){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
            // req.session.isLoggedIn = false;
        }
    });
})


module.exports = router;

//module.exports = {'secret': 'supersecret'};



