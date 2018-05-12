/**
 * Created by KlaraMariaDersche on 11.04.18.
 */
var express = require('express');
var router = express.Router();
var dbPromise = require('../db');


router.get('/', async function(req, res, next) {

    var allMembers = await dbPromise.User.findAll({
        attributes: ['id', 'userName', 'city']
    })
    //console.log(allMembers.dataValues.id);

    res.render('community', {
        test: 'My TD platform',
        test2: allMembers
    });
});


module.exports = router;