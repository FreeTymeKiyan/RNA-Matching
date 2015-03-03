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
      res.download(dir + "/result.zip");
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
  var dir = DOWNLOAD_PATH + id + "/result.zip";
  if (fs.existsSync(dir)) {
    res.json({hasGenerated: true});
  } else {
    res.json({hasGenerated: false});
  }
});

module.exports = router;
