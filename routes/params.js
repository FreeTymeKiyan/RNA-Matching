var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
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
  console.log(req.body);
  var cmd = 'perl ' + perlScript
    + " " + miRNADir + req.body.miRNA 
    + " " + mRNADir + req.body.mRNA 
    + " " + resDir + targetProf1
    + " " + resDir + targetProf2
    + " " + resDir + targetProf3
    + " " + req.body.top
    + " " + req.body.match;
  console.log(cmd);
  child = exec(cmd, function (err, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (err !== null) {
      console.log('exec error: ' + err);
    }
  });
  res.send(req.body);
});

module.exports = router;
