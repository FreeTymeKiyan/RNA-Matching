const HALF_MIN = 30 * 1000;
const SERVER_ADDR = "http://bioinf1.indstate.edu/";
const RESULT_ADDR = SERVER_ADDR + "result";
const DOWNLOAD_ADDR = SERVER_ADDR + "download";

var check = function () {
  $.post(RESULT_ADDR, { id : id }, 
    function (data) {
      if (!data) {
        return;
      }
      if (data.hasGenerated) {
        window.location.replace(DOWNLOAD_ADDR + "?sid=" + id);
      } else {
        console.log("not generated");
        setTimeout(check, HALF_MIN);
      }
  });
};

var checkResult = function (id) {
  setTimeout(check, HALF_MIN);
};
