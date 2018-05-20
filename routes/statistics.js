/**
 * Created by KlaraMariaDersche on 11.04.18.
 */
var express = require('express');
var router = express.Router();
var dbPromise = require('../db');
var jwt = require('jsonwebtoken');

var config = require('../config');

router.get('/', async function(req, res, next) {


    var trainingDisplay = await dbPromise.Training.findAll({
        attributes: ['description', 'startDate', 'startTime', 'endTime', 'updatedAt'],
        where: {
            userId: req.session.userId
        },
        order: [['updatedAt', 'DESC']]
    });


    var weightDisplay = await dbPromise.Weight.findAll({
        attributes: ['weightKG', 'weightDate', 'updatedAt'],
        where: {
            userId: req.session.userId
        },
        order: [['updatedAt', 'DESC']]

    });

    console.log("Statistics post request fired")


    console.log(req.session.userId);
    res.render('statistics', {weighttest: weightDisplay, trainingstest: trainingDisplay})
});



router.get('/statistics/:id', function(req,res,next){
    res.render('statistics');
})

module.exports = router;