
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
        text: 'This helps to track your body and activites',

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


/****************** REST API STUFF ***********/

router.post('/api/login', async function(req,res,next){
    if(req.body.username && req.body.userpw) {
        try{
        //Find the user with those credentials in the database and fetch aslo the pw for hte password check

        var userQuery = await dbPromise.User.findOne({
            attributes: ['id', 'pw', 'userName'],
            where: {
                userName: req.body.username
            }
        })
            if (!userQuery) return res.status(404).send("No user found");
       // if (err) return res.status(500).send("Error");
        var passwordCheckApi = bcrypt.compare(req.body.userpw, userQuery.dataValues.pw);

        if (!passwordCheckApi) return res.status(401).send({auth: false, token: null}, "Wrong password");


        var usertoken = jwt.sign({id: userQuery.dataValues.id, username: userQuery.dataValues.userName}, config.secret, {expiresIn: 86400});
        console.log(usertoken);
        var testusertoken = jwt.verify(usertoken, config.secret);
        console.log(testusertoken);
        //create an access token   - jwt.verify to parse it back
        var accesstoken = jwt.sign ({id: userQuery.dataValues.id}, config.secret, {expiresIn: 86400});
        console.log(accesstoken);
            console.log(req.params.id);
        res.status(200).send({auth: true, token: usertoken})

    } catch (error) {

        res.status(400).send("Errorrr");
    }

}});


router.post('/api/weight', async function(req,res,next){
 try {
     try {
         var headertest = req.headers["authorization"];
     } catch (error) {
         console.log(error);
         res.status(401).send("Authorization header is missing");
     }


     var accesstoken = headertest.substring(7);

     try {
         var unwrappedaccesstoken = jwt.verify(accesstoken, config.secret);
     } catch(error) {
         console.log(error);
         res.status(400).send("Token is broken");
     }
     console.log(unwrappedaccesstoken.valueOf().id);
     console.log(req.body.userId);
     console.log('hi');
    //getting the userID from the body and then check if it the same from the unwrappedtoken
     if(unwrappedaccesstoken.valueOf().id == req.body.userId) {
         await dbPromise.Weight.create({
             userId: unwrappedaccesstoken.valueOf().id,
             weightDate: req.body.weightdate,
             weightKG: req.body.weightkg
         })

         res.status(204).send("Everything went fffiiiiiiiine");
     }
     //res.redirect('/useraccount/');
     } catch (error){
     res.status(400).send("Something is wrong");
 }
});

router.post('/api/training', async function(req,res,next){
    try {
        try {
            var headertest = req.headers["authorization"];
            console.log(headertest);
        } catch (error) {
            console.log(error);
            res.status(401).send("Authorization header is missing");
        }


        var accesstoken = headertest.substring(7);

        try {
            var unwrappedaccesstoken = jwt.verify(accesstoken, config.secret);
        } catch(error) {
            console.log(error);
            res.status(400).send("Token is broken");
        }
        console.log(unwrappedaccesstoken.valueOf().id);


        await dbPromise.Training.create({
            userId: unwrappedaccesstoken.valueOf().id,
            startDate: req.body.startdate,
            startTime: req.body.starttime,
            endDate: req.body.enddate,
            endTime: req.body.endtime,
            description: req.body.details
        })

        res.status(204).send("Everything went fffiiiiiiiine");

        //res.redirect('/useraccount/');
    } catch (error){
        res.status(400).send("Something is wrong");
    }
});



module.exports = router;

//module.exports = {'secret': 'supersecret'};



