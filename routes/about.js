/**
 * Created by KlaraMariaDersche on 14.05.18.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('about', {
    });
});



module.exports = router;
