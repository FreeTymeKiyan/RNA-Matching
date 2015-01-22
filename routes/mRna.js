var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

router.get('/', function(req, res, next) {
  var files = fs.readdirSync(path.join(__dirname, '..', 'public', 'database', 'mRNA'));
  res.json(files);
});

module.exports = router;
