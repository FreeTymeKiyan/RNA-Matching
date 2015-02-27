var fs = require('fs');
var archiver = require('archiver');

const FILE_LIST = ['output.txt', 'output.txt.sorted.10.table.expression.txt', 'Plot_chart_y2Axis.xlsx', 'sorted.10.output.txt', 'sorted.output.txt'];

var writeZip = function () {
  var archive = archiver('zip'); // avoid queue close
  archive.on('error', function(err) {
    throw err;
  });
  var id = parseInt(fs.readFileSync('id.txt', { encoding : 'utf8'}));
  var path = __dirname + '/../public/downloads/' + id;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var output = fs.createWriteStream(path + '/results.zip');
  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });
  
  archive.pipe(output);
  for (x in FILE_LIST) {
    archive.append(fs.createReadStream(FILE_LIST[x]), { name: FILE_LIST[x] });
  }
  archive.finalize();
  // TODO generate download link using id
  // TODO put download link in page and email
  // TODO send mail using command
  id += 1;
  fs.writeFileSync('id.txt', id);
};

exports.writeZip = writeZip;
