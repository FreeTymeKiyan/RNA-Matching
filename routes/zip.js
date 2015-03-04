var fs = require("fs");
var archiver = require("archiver");
var sendMail = require("./sendMail").sendMail;
var hash = require("./id");
var path = require("path");

const DOWNLOAD_PATH = path.join(__dirname, "/../public/downloads/");


var zipSend = function (toEmail, top, id) {
  /*generate file list according to top*/
  var FILE_LIST = ["output.txt", "Plot_chart_y2Axis.xlsx", "sorted.output.txt"];
  FILE_LIST.push("sorted." + top + ".table.expression.txt");
  FILE_LIST.push("sorted." + top + ".output.txt");
  /*zip results to a file*/
  var archive = archiver("zip"); // avoid queue close
  archive.on("error", function(err) {
    throw err;
  });
  var path = DOWNLOAD_PATH + id;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var output = fs.createWriteStream(path + "/result.zip");
  output.on("close", function() { // zip is done
    /*send mail using command*/
    console.log(archive.pointer() + " total bytes");
    console.log("archiver has been finalized and the output file descriptor has closed.");
    sendMail(id, toEmail);
  });
  
  archive.pipe(output);
  for (x in FILE_LIST) {
    archive.append(fs.createReadStream(path + "/" + FILE_LIST[x]), { name: FILE_LIST[x] });
  }
  archive.finalize();
};

exports.zipSend = zipSend;
