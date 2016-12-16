var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log('runs');
  res.render('index', { title: 'Final Project' });
});

router.post('/save', function(req, res, next) {
  var db = req.db;
  var collection = db.get('newCollection');
  var data = req.res.req.body;

  collection.update(
   { _id: data.id },
   { $set: {
      First: data.First,
      Last: data.Last,
      Street: data.Street,
      City: data.City,
      State: data.State,
      Zip: data.Zip,
      Phone: data.Phone,
      Email: data.Email,
      Preferance: data.Preferance,
    }
   },
   { upsert: false },
   function(err, doc){
     if (err) {
       console.log(err);
     }
     else {
       console.log(doc);
     }
   }
  );
  res.send('success')
});

router.post('/delete', function(req, res, next) {
  var db = req.db;
  var collection = db.get('newCollection');
  var data = req.res.req.body;

  collection.remove({"_id": data.id});
});

module.exports = router;
