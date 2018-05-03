/**
 * Created by KlaraMariaDersche on 30.03.18.
 */
var express = require('express');
var router = express.Router();
//var data = (../dummy-data);
/* GET account page. */
router.get('/', function(req, res, next) {
    res.render('account', {
        title: 'My TD platform',
        text: 'This helps to track your body and activites'
    });
});


module.exports = router;
