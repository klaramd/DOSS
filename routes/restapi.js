/**
 * Created by KlaraMariaDersche on 21.05.18.
 */

var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');



var config = require('../config');
var dbPromise = require('../db');

/****************** REST API STUFF ***********/

router.post('/login', async function(req,res,next){
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


router.post('/weight', async function(req,res,next){
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

router.post('/training', async function(req,res,next){
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
