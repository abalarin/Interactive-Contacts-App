var express = require('express');
var router = express.Router();

var ensureLoggedIn = function(req, res, next) {
	if ( req.user ) {
    console.log(req);
		next();
	}
	else {
		res.redirect("/login");
	}
}

/* GET home page. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  var db = req.db;
  var collection = db.get('newCollection');

  console.log('user: ', req.user);
  collection.find({},{},function(e,docs){
        res.render('contacts', {data: docs, user: req.user});
    });
});

router.post('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('newCollection');

  collection.find({},{},function(e,docs){
        // console.log('mong: ', docs);
        res.send({data: docs});
    });
});
module.exports = router;
