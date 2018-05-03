/**
 * Created by KlaraMariaDersche on 11.04.18.
 */
var express = require('express');
var router = express.Router();




var communityfunction= {//getallUsers from the database with the name and city except the current ID
}


router.get('/', function(req, res, next) {
    res.render('community', {
        community: communityfunction
    });
});


module.exports = router;