var express = require("express");
var router = express.Router();
var fs = require("fs");

const DOWNLOAD_PATH = "../public/downloads/";

/*
  For download
*/
router.get("/", function(req, res, next) {
  var id = req.query.sid;
  if (!id) res.render("download");
  else {
    var dir = DOWNLOAD_PATH + id;
    if (fs.existsSync(dir)) {
      var d = new Date();
      var timestamp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      res.download(dir + "/result_" + timestamp + ".zip");
    } else {
      res.render("download", { id : id, exists : false });
    }
  }
});

/*
  For check 
*/
router.post("/", function (req, res, next) {
  var id = req.body.id;
  var d = new Date();
  var timestamp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  var dir = DOWNLOAD_PATH + id + "/result_" + timestamp + ".zip";
  if (fs.existsSync(dir)) {
    res.json({hasGenerated: true});
  } else {
    res.json({hasGenerated: false});
  }
});

module.exports = router;
