var fs = require('fs');
var archiver = require('archiver');
var sendMail = require('./sendMail').sendMail;

const FILE_LIST = ['output.txt', 'output.txt.sorted.10.table.expression.txt', 'Plot_chart_y2Axis.xlsx', 'sorted.10.output.txt', 'sorted.output.txt'];

var zipSend = function (toEmail) {
  var archive = archiver('zip'); // avoid queue close
  archive.on('error', function(err) {
    throw err;
  });
  var id = parseInt(fs.readFileSync('id.txt', { encoding : 'utf8'}));
  var path = __dirname + '/../public/downloads/' + id;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var output = fs.createWriteStream(path + '/result.zip');
  output.on('close', function() {
    // TODO send mail using command
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    sendMail(id, toEmail);
    // TODO put download link in page and email
    id += 1;
    fs.writeFileSync('id.txt', id);
  });
  
  archive.pipe(output);
  for (x in FILE_LIST) {
    archive.append(fs.createReadStream(FILE_LIST[x]), { name: FILE_LIST[x] });
  }
  archive.finalize();
};

exports.zipSend = zipSend;

