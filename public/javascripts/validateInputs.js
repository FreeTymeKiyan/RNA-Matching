$(document).ready(function () {
  $("span#email").hide();
  
  $('button#submit').click(function () {
      console.log($('select#input1').val());
      console.log($('select#input2').val());
      console.log($('select#top').val());
      console.log($('select#database').val());
      console.log($('input#email').val());
  });
  
  $('select#input1').on('change', function (e) {
    console.log('select input1: ' + $(this).val());
  });
  
  $('select#input2').on('change', function (e) {
    console.log('select input2: ' + $(this).val());
  });
  
  $('select#top').on('change', function (e) {
    console.log('select top: ' + $(this).val());
  });
  
  $('select#database').on('change', function (e) {
    console.log('select database: ' + $(this).val());
  });
  
  $('input#email').on('change', function (e) {
    console.log("input email: " + $(this).val());
    // TODO validate email and show state
    var email = $(this).val()
    $('span#email').hide();
    if (email) {
      $('div#email').removeClass('has-error');
      $('div#email').addClass('has-success');
      $('span#email.glyphicon').show();
    } else {
      $('div#email').removeClass('has-success');
      $('div#email').addClass('has-error');
      $('span#email').hide();
      $('span#email.help-block').show();
    }
  });
});
