var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var mail = require('./sendEmail');
var fs = require('fs');
var writeZip = require('./zip').writeZip;
var child;

var publicDir = '../public';
var databaseDir = publicDir + '/database';

var miRNADir = databaseDir + '/miRNA/';
var mRNADir = databaseDir + '/mRNA/';
var resDir = databaseDir + '/result/';
var targetProf1 = 'Targetprofiler_full.txt';
var targetProf2 = 'targetscan_60_output_Redo.txt.preprocess.out.txt';
var targetProf3 = 'v5.txt.homo_sapiens.hsa.miRanda.txt';
var perlScript = databaseDir + '/scripts/' + 'MMiRNA-Plot_predict.pl';

router.post('/', function(req, res, next) {
  var miRna = miRNADir + req.body.miRna;
  var mRna = mRNADir + req.body.mRna;
  if (req.files) {
    if (req.files.miRnaFromUsr) {
      miRna = req.files.miRnaFromUsr.path; // path to the file
    }
    if (req.files.mRnaFromUsr) {
      mRna = req.files.mRnaFromUsr.path; // path to the file
    }
  }
  var cmd = buildCmd(miRna, mRna, req);
  // console.log(cmd);
  child = exec(cmd, function (err, stdout, stderr) {
    if (stderr) {
      console.log('stderr: ' + stderr);
      return;
    }
    if (err) {
      console.log('exec error: ' + err);
      return;
    }
    console.log('Results generated stdout: ' + stdout);
    // zip to a new directory
    writeZip();
  });
  // a result page
  res.render('params', { params : req.body });
});

var buildCmd = function (miRna, mRna, req) {
  return 'perl ' + perlScript
    + ' ' + miRna
    + ' ' + mRna
    + ' ' + resDir + targetProf1
    + ' ' + resDir + targetProf2
    + ' ' + resDir + targetProf3
    + ' ' + req.body.top
    + ' ' + req.body.match;
}

module.exports = router;
