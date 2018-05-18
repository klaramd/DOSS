/**
 * Created by KlaraMariaDersche on 11.04.18.
 */
var express = require('express');
var router = express.Router();
var dbPromise = require('../db');
var jwt = require('jsonwebtoken');

var config = require('../config');

/* GET account page. */
router.get('/', async function(req, res, next) {


    var trainingDisplay = await dbPromise.Training.findAll({
        attributes: ['description', 'startDate', 'startTime', 'endTime'],
        where: {
            userId: req.session.userId
        }
    });


    var weightDisplay = await dbPromise.Weight.findAll({
        attributes: ['weightKG', 'weightDate'],
        where: {
            userId: req.session.userId
        }

    });

    console.log("Statistics post request fired")


    console.log(req.session.userId);
    res.render('statistics', {weighttest: weightDisplay, trainingstest: trainingDisplay})
});



router.get('/statistics/:id', function(req,res,next){
    res.render('statistics');
})

module.exports = router;