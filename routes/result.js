var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/*
  For download
*/
router.get('/', function(req, res, next) {
  var id = req.query.sid;
  if (!id) res.render('download', { id : 0 });
  else {
    var dir = '../public/downloads/' + id;
    if (fs.existsSync(dir)) {
      res.download(dir + '/result.zip');
    } else {
      res.render('download', { id : id, exists : false });
    }
  }
});

/*
  For check 
*/
router.post('/', function (req, res, next) {
  var id = req.query.sid;
  var dir = '../public/downloads/' + id;
  if (fs.existsSync(dir)) {
    // res.render('download', { id : id , exists : true });
    res.json({hasGenerated: true});
  } else {
    res.json({hasGenerated: false});
  }
});

module.exports = router;
