var express = require('express');
var router = express.Router();

var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyBuM7ZEgpovl0ZuGJHGm4iA-CsFCmwnBm8',
};
var geocoder = NodeGeocoder(options);


router.post('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('UserCollection1');
  data = req.res.req.body;
  var address = data.Street + ', ' + data.City + ' ' + data.State + ', ' + data.Zip;

  geocoder.geocode(address)
    .then(function(geo) {
      formated = geo[0];
      console.log(geo);

      //Insert into collection
      collection.insert(
        //Document Model
        {
          'First': data.First,
          'Last': data.Last,
          'Coordinates':
            [{'lat': formated.latitude},
            {'lon': formated.longitude}],
          'Street': formated.streetNumber + ' ' + formated.streetName,
          'City': formated.city,
          'State': formated.administrativeLevels.level1long,
          'Zip': formated.zipcode,
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
    })
    .catch(function(err) {
      res.end(err + "There was a problem geocoding data.");
    });



  //res.render('success', data)
});

module.exports = router;
