var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.redirect('/mmirna-tar');
  res.render("index");
});

module.exports = router;
