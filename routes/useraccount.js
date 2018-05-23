/**
 * Created by KlaraMariaDersche on 11.04.18.
 */
var express = require('express');
var router = express.Router();
var dbPromise = require('../db');


/* GET account page. */
router.get('/', async function(req, res, next) {
    res.render('useraccount')
});


//Getting new trainings input
router.post('/submittraining', async function(req,res,next){
    //check if their is an ID in the session
    if(req.session.userId == null){
        res.render('nicetry');
    } else {
        //var currentID = req.params.id;
        await
        dbPromise.Training.create({
            userId: req.session.userId,
            startDate: req.body.startdate,
            startTime: req.body.starttime,
            endDate: req.body.enddate,
            endTime: req.body.endtime,
            description: req.body.details
        })
        res.redirect('/useraccount/')
    }
});

//Getting new weight input
router.post('/submitweight', async function(req,res,next){
    if(req.session.userId == null){
        res.render('nicetry');
    } else {
        // var currentID = req.params.id;
        await dbPromise.Weight.create({
            userId: req.session.userId,
            weightDate: req.body.weightdate,
            weightKG: req.body.weightkg
        })

        res.redirect('/useraccount/');
    }
});



//Logout
router.post('/logout', function(req,res,next){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
})

module.exports = router;