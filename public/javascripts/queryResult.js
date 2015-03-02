const HALF_MIN = 30 * 1000;
const ADDR = "http://bioinf1.indstate.edu/result";

var check = function (id) {
  $.post(ADDR, { id : id }, 
    function (data) {
      if (!data) {
        console.log("no data");
        return;
      }
      if (!data.hasGenerated) {
        console.log("not generated");
        setTimeout(checkResult(id), HALF_MIN);
      }
    }, 
    "json");
};

var checkResult = function (id) {
  setTimeout(check(id), HALF_MIN);
};
