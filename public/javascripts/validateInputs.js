$(document).ready(function () {
  $("span.glyphicon").hide();
  $("span.help-block").hide();
  
  $('input#email').on('change', function (e) {
    var email = $(this).val()
    $('span#email').hide();
    if (!email) {
      noEmail();
    } else {
      isValidEmail();
    }
  });
});

var validateMiRna = function () {
  var miRna = $('input#input1').val();
  if (!miRna) {
    $('#fg1').addClass('has-error');
    return false;
  }
  $('#fg1').removeClass('has-error');
  $('#fg1').addClass('has-success');
  console.log(miRna);
  return true;
}

var validateMRna = function () {
  var mRna = $('input#input2').val();
  if (!mRna) {
    $('#fg2').addClass('has-error');
    return false;
  }
  $('#fg2').removeClass('has-error');
  $('#fg2').addClass('has-success');
  console.log(mRna);
  return true;
}

var validateEmail = function () {
  var email = $('input#email').val();
  $('span#email').hide();
  if (!email) {
    noEmail();
    return false;
  }
  isValidEmail();  
  console.log(email);
  return true;
}

var validateForm = function () {
  // console.log(validateMiRna() && validateMRna() && validateEmail());
  var res1 = validateMiRna();
  var res2 = validateMRna();
  var res3 = validateEmail();
  return res1 && res2 && res3;
}

var noEmail = function () {
  noInput('div#email', 'span#email.help-block', 'span#email.glyphicon.glyphicon-remove');
}

var isValidEmail = function () {
  validInput('div#email', 'span#email.glyphicon.glyphicon-ok');
}

var noInput = function (div, helpBlock, span) {
  $(div).removeClass('has-success');
  $(div).addClass('has-error');
  $(helpBlock).show();
  $(span).show();
}

var validInput = function (div, span) {
  $(div).removeClass('has-error');
  $(div).addClass('has-success');
  $(span).show();
}
