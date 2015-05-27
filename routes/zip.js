var fs = require("fs");
var archiver = require("archiver");
var sendMail = require("./sendMail").sendMail;
var hash = require("./id");
var path = require("path");
var rm = require("rimraf");

const DOWNLOAD_PATH = path.join(__dirname, "/../public/downloads/");
const DEST_PATH = path.join(__dirname, "/../../../scr/mmirna-tar/");

var zipSend = function (toEmail, top, id) {
  /*zip results to a file*/
  var archive = archiver("zip"); // avoid queue close
  archive.on("error", function(err) {
    throw err;
  });
  var outputDir = DOWNLOAD_PATH + id;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  var destDir = DEST_PATH + id;
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }
  var d = new Date();
  var timestamp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  var output = fs.createWriteStream(destDir + "/result_" + timestamp + ".zip");
  output.on("close", function() { // zip is done
    /*send mail using command*/
    console.log(archive.pointer() + " total bytes");
    console.log("archiver has been finalized and the output file descriptor has closed.");
    sendMail(id, toEmail);
  });
  
  archive.pipe(output);
  archive.directory(outputDir, false, { date: new Date() });
  archive.finalize();
  rm(outputDir, function () {
    console.log("removed");
  });
};

exports.zipSend = zipSend;
