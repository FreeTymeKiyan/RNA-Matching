var express = require("express");
var router = express.Router();
var exec = require("child_process").exec;
var fs = require("fs");
var path = require("path");

var hash = require("./id");
var zipSend = require("./zip").zipSend;
var child;

var publicDir = "../public";
var databaseDir = publicDir + "/database";

var miRNADir = databaseDir + "/miRNA/";
var mRNADir = databaseDir + "/mRNA/";
var resDir = databaseDir + "/result/";
var targetProf1 = "Targetprofiler_full.txt";
var targetProf2 = "targetscan_60_output_Redo.txt.preprocess.out.txt";
var targetProf3 = "v5.txt.homo_sapiens.hsa.miRanda.txt";
var perlScript = databaseDir + "/scripts/" + "MMiRNA-Plot_predict.pl";

const DOWNLOAD_PATH = path.join(__dirname, "..", "public", "downloads");

router.post("/", function(req, res, next) {
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
  var rawId = parseInt(fs.readFileSync("id.txt", { encoding : "utf8"}));
  var id = hash.getId(rawId);
  fs.writeFileSync("id.txt", rawId + 1); // update session id
  var cmd = buildCmd(miRna, mRna, req, id);
  // console.log(cmd);
  child = exec(cmd, function (err, stdout, stderr) {
    if (stderr) {
      console.log("stderr: " + stderr);
      return;
    }
    if (err) {
      console.log("exec error: " + err);
      return;
    }
    console.log("Results generated stdout: " + stdout);
    zipSend(req.body.email, req.body.top, id);
  });
  // a result page with job id
  res.render("params", { params : req.body, id: id});
});

var buildCmd = function (miRna, mRna, req, id) {
  return "perl " + perlScript
    + " " + miRna
    + " " + mRna
    + " " + resDir + targetProf1
    + " " + resDir + targetProf2
    + " " + resDir + targetProf3
    + " " + req.body.top
    + " " + req.body.match
    + " " + DOWNLOAD_PATH + "/" + id;
}

module.exports = router;
