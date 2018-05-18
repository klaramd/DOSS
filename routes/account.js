/**
 * Created by KlaraMariaDersche on 30.03.18.
 */

var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');



var config = require('../config');
var dbPromise = require('../db');

router.get('/', function(req, res, next) {
    res.render('account', {
        title: 'My TD platform',
        text: 'This helps to track your body and activites'
    });
});





module.exports = router;
