var express = require('express');
var router = express.Router();

var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyBuM7ZEgpovl0ZuGJHGm4iA-CsFCmwnBm8', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);


router.post('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('UserCollection');
  data = req.res.req.body;

  geocoder.geocode({address: data.Street, zipcode: data.Zip})
    .then(function(geo) {
      //console.log(geo[0]);

      //Insert into collection
      collection.insert(
        //Document Model
        {
          'First': data.First,
          'Last': data.Last,
          'Coordinates':
            [{'lat': geo[0].latitude},
            {'lon': geo[0].longitude}],
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
    })
    .catch(function(err) {
    res.end(err + "There was a problem geocoding data.");
    });



  //res.render('success', data)
});

module.exports = router;
