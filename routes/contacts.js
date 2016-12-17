var express = require('express');
var router = express.Router();

//Geocoder for insertion into mongDB
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyBuM7ZEgpovl0ZuGJHGm4iA-CsFCmwnBm8',
};
var geocoder = NodeGeocoder(options);

//Ensure loggedin
var ensureLoggedIn = function(req, res, next) {
	if ( req.user ) {
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

  data = req.res.req.body;
  if(!data.modalForm){//if req is not from Modal
    collection.find({},{},function(e,docs){
      // console.log('mong: ', docs);
      res.send({data: docs});
    });
  }
  else{//Else if from Modal store into DB
    var address = data.Street + ', ' + data.City + ' ' + data.State + ', ' + data.Zip;

    geocoder.geocode(address)
      .then(function(geo) {
        formated = geo[0];
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
             }
             else {// Success
               console.log(doc);
               collection.find({},{},function(e,docs){
                 res.render('contacts', {data: docs});
               });
             }
          }
      );
    })
    .catch(function(err) {
      res.end(err + "There was a problem geocoding data.");
    });
  }
});
module.exports = router;
