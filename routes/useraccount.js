/**
 * Created by KlaraMariaDersche on 11.04.18.
 */
var express = require('express');
var router = express.Router();

var data = ("../dummy-data");
/* GET account page. */
router.get('/', function(req, res, next) {
    res.render('useraccount')
});

/*
router.get('/useraccount/:id', function(req, res,next){
    res.render('useraccount', {output: req.params.id});
});*/

module.exports = router;