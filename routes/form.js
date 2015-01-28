var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  var miRnafiles = fs.readdirSync(path.join(__dirname, '..', 'public', 'database', 'miRNA')); // [ 'All_miRNA.txt' ]
  var mRnafiles = fs.readdirSync(path.join(__dirname, '..', 'public', 'database', 'mRNA'));
  var miRNA = generateList(miRnafiles);
  var mRNA = generateList(mRnafiles);
  res.render('form', {
    miRna: miRNA, 
    mRna: mRNA
  });
});

var generateList = function (files) {
  var list = [];
  for (x in files) {
    var file = {};
    file.value = files[x];
    file.name = files[x].slice(0, files[x].lastIndexOf("."));
    list.push(file);
  }
  return list;
};

module.exports = router;
