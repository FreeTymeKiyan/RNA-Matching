var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
var fs = require('fs');

var EMAIL_ADDR = 'freetymekiyan@foxmail.com';
var PWD = '0Forever0'
var FILE_NAMES = ["output.txt.sorted", "output.txt.sorted.10.table.expression.txt", "output.txt.sorted.10", "Plot_chart_y2Axis.xlsx"];

var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: EMAIL_ADDR,
    pass: PWD
  }
});

var mailOpts = {
  from: EMAIL_ADDR, 
  subject: 'Your Recent MRNA MiRNA Plot Result', 
  text: 'Hello, \n\nThe result files are in the attachment. Feel free to give us any feedback. \n\nThank you very much! \n\nBest',
  attachments: [
    {
      filename: 'result1.txt',
      content: 'result1'
    },
    {
      filename: 'result2.txt',
      path:'./output.txt'
    }
  ]
};

var buildAndSend = function (toEmail, directory) {
  mailOpts.to = toEmail; // set to email
  mailOpts.attachments = []; // set attachments
  var files = fs.readdirSync(directory);
  for (x in files) {
    if (FILE_NAMES.indexOf(files[x]) == -1) continue;
    var file = {};
    file.filename = files[x];
    file.path = directory + files[x];
    mailOpts.attachments.push(file);
  }
  // console.log(mailOpts);
  transporter.sendMail(mailOpts, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('Results sent: ' + info.response);
    }
  });
};

exports.buildAndSend = buildAndSend;
