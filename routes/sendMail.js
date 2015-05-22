var exec = require('child_process').exec;
/*
 * cat Template.txt | mailx -v -s "Your Recent MMiRNA-Tar Result" -r
 * "help@bioinf1.indstate.edu" -a ../public/downloads/1/result.zip
 * freetymesunkiyan@gmail.com
 */

var buildCommand = function(id, toEmail) {
  var d = new Date();
  var timestamp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  return 'echo "Hi,\n\nYour recent calculation result is in the attachment. You can also download it here: http://bioinf1.indstate.edu/download?sid=' + id + ' \n\nIf you have any questions, suggestions, or to report problems, you may reply directly to help@bioinf1.indstate.edu. We will get in touch with you as soon as possible. \n\nThank you very much for using this tool.\n\nBest regards,\nMMiRNA-Tar Team"'
    + ' | '
    + 'mailx -s "Your Recent MMiRNA-Tar Result" -r "help@bioinf1.indstate.edu" -a '
    + "../public/downloads/" + id + "/result_" + timestamp + ".zip"
    + " " + toEmail;
};

var sendMail = function(id, toEmail) {
  var cmd = buildCommand(id, toEmail);
  console.log(cmd);
  exec(cmd, function (err, stdout, stderr) {
    if (stderr) {
      console.log('stderr: ' + stderr);
      return;
    }
    if (err) {
      console.log('exec error: ' + err);
      return;
    }
    console.log('Results generated stdout: ' + stdout);
  });
}

exports.sendMail = sendMail;
