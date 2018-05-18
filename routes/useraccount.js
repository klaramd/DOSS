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

/*
router.get('/useraccount/:id', function(req, res,next){
    res.render('useraccount', {output: req.params.id});
});*/

module.exports = router;