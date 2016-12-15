var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/', function(req, res, next) {
  console.log(req.res.req.body);
  data = req.res.req.body;
  doc = {
    Preferance: data.Preferance,
    Last: data.Last
  }
  res.send('success')
});
module.exports = router;
