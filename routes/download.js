var express = require('express');
var router = express.Router();
var fs = require('fs');

var hashId = require("./id");

router.get('/', function(req, res, next) {
  var id = req.query.sid;
  if (!id) res.render('download');
  else res.render('download', { id : id , exists : true });
});

module.exports = router;
