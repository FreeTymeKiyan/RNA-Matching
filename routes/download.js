var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

router.get('/', function(req, res, next) {
  var id = req.query.sid;
  if (!id) res.render('download', { id : 0 });
  else res.render('download', { id : id , exists : true });
  // else res.download('../public/downloads/' + id + '/results.zip');
});

module.exports = router;
