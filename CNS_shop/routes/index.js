var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'CNS_Shop', shopname: '正光' });
    
    //res.render('index', {  });
});

module.exports = router;
