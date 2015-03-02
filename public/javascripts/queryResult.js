const HALF_MIN = 30 * 1000;
const ADDR = "http://bioinf1.indstate.edu/result";

var checkResult = function (id) {
  var request = $.ajax({
    url: ADDR,
    type: "POST",
    data: { id : id },
    dataType: "json"
  });

  request.done(function(msg) {
    if (!msg) return;
    
    if (!msg.hasGenerateed) {
      setTimeout(request, HALF_MIN);
    }
  });

  request.fail(function(jqXHR, textStatus) {
    alert("Request failed to send: " + textStatus);
  });
};
