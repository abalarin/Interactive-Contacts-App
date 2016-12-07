var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('UserCollection');
  data = req.res.req.body;

  console.log(data);
  //Insert into collection

  collection.insert(
    //Document Model
    {
      'First': data.First,
      'Last': data.Last,
      'Street': data.Street,
      'City': data.City,
      'State': data.State,
      'Zip': data.Zip,
      'Phone': data.Phone,
      'Email': data.Email,
      'Preferance': data.Preferance,
      'ContactMethod':
        [{'Mail': data.ContactMail},
        {'Phone': data.ContactPhone},
        {'Email': data.ContactEmai}]
    },
    //Callback
    function (err, doc) {
      if (err) {
        //If it failed, return error
        console.log(err);
        res.end("There was a problem adding the information to the database.");
       }
       else {
         // Success
         console.log(doc);
         res.render('success', doc)
       }
    }
  );

  //res.render('success', data)
});

module.exports = router;
