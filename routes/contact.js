/**
 * Created by KlaraMariaDersche on 11.04.18.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('contact', {
    });
});

//Contact infos
router.post('/submit', function(req,res,next){
    var newContact = {
        contactemail: req.body.contactemail,
        contactreference: req.body.contactreference,
        contactmes: req.body.contactmes
    };
    res.redirect('/contact');
    console.log(newContact);
});

module.exports = router;