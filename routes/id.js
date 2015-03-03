var Hashids = require("hashids"),
    hashids = new Hashids("bioinf1 mmirna tar", 8);

var getId = function (id) {
  return hashids.encode(id);
}

var decodeId = function (encoded) {
  return hashids.decode(encoded);
}

exports.getId = getId;
exports.decodeId = decodeId;
