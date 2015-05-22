var fs = require("fs");
var archiver = require("archiver");
var sendMail = require("./sendMail").sendMail;
var hash = require("./id");
var path = require("path");

const DOWNLOAD_PATH = path.join(__dirname, "/../public/downloads/");

var zipSend = function (toEmail, top, id) {
  /*zip results to a file*/
  var archive = archiver("zip"); // avoid queue close
  archive.on("error", function(err) {
    throw err;
  });
  var path = DOWNLOAD_PATH + id;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var d = new Date();
  var timestamp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  var output = fs.createWriteStream(path + "/result_" + timestamp + ".zip");
  output.on("close", function() { // zip is done
    /*send mail using command*/
    console.log(archive.pointer() + " total bytes");
    console.log("archiver has been finalized and the output file descriptor has closed.");
    sendMail(id, toEmail);
  });
  
  archive.pipe(output);
  archive.directory(path);
  archive.finalize();
};

exports.zipSend = zipSend;
