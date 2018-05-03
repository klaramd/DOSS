/**
 * Created by KlaraMariaDersche on 11.04.18.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('contact', {
    });
});

module.exports = router;