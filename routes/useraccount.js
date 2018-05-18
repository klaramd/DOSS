/**
 * Created by KlaraMariaDersche on 11.04.18.
 */
var express = require('express');
var router = express.Router();
var dbPromise = require('../db');


/* GET account page. */
router.get('/', async function(req, res, next) {
    /*
    var userName =    var allMembers = await dbPromise.User.findOne({
        attributes: ['id', 'userName', 'city']
    })*/
    res.render('useraccount')
});


//Getting new trainings input
router.post('/submittraining', async function(req,res,next){
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
router.post('/submitweight', async function(req,res,next){
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



//Logout
//Can't destroy it since action thingy works only with forms
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