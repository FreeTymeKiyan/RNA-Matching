$.ajax({
  url:"/miRna",
  success: function (data) {
    for (x in data) {
      var dotIdx = data[x].lastIndexOf(".");
      $("select#input1")
        .append(
          $("<option>", { value : data[x] }).text(data[x].slice(0, dotIdx))
        );
    }
  }
});

$.ajax({
  url:"/mRna",
  success: function (data) {
    for (x in data) {
      var dotIdx = data[x].lastIndexOf(".");
      $("select#input2")
        .append(
          $("<option>", { value : data[x] }).text(data[x].slice(0, dotIdx))
        );
    }
  }
});
