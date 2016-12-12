var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('UserCollection1');

  collection.find({},{},function(e,docs){
        //console.log('mong: ', docs);
        res.render('contacts', {data: docs});
    });
});

router.post('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('UserCollection1');

  collection.find({},{},function(e,docs){
        //console.log('mong: ', docs);
        res.send({data: docs});
    });
});
module.exports = router;
