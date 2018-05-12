/**
 * Created by KlaraMariaDersche on 11.04.18.
 */
var express = require('express');
var router = express.Router();


/* GET account page. */
router.get('/', function(req, res, next) {
    res.render('statistics')
});

module.exports = router;