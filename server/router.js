var fs = Npm.require('fs');
var Path = Npm.require('path');

var Archiver = Meteor.npmRequire('archiver');
var Mime = Meteor.npmRequire('mime');
var Busboy = Meteor.npmRequire('busboy');

var rootDir = Meteor.settings.private.rootDir;
var maxFileSize = Meteor.settings.private.maxFileSize || '100mb';

Router.onBeforeAction(Iron.Router.bodyParser.json({limit: maxFileSize}));

/**
 * Download file or ziped folder
 */
Router.route('/download', function () {
  var self = this;
  var file = self.request.query.file;
  var direct = self.request.query.direct || false;
  check(file, String);

  var realFile = Path.join(rootDir, file);

  fs.stat(realFile, function (err, stats) {
    if (stats.isFile()) {
      var fileName = Path.basename(realFile);
      var mime = Mime.lookup(fileName);
      // download
      if (!direct) {
        self.response.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        self.response.setHeader('Content-type', mime);
        self.response.setHeader('Content-length', stats.size);
      }

      fs.createReadStream(realFile, {
        'bufferSize': 4 * 1024
      }).pipe(self.response);
    } else if (stats.isDirectory()) {
      var fileName = Path.basename(realFile) + '.zip';
      self.response.setHeader('Content-disposition', 'attachment; filename=' + fileName);
      self.response.setHeader('Content-type', 'application/zip, application/octet-stream');

      var archiver = Archiver.create('zip', {});
      archiver.directory(realFile, './');
      archiver.finalize();
      archiver.pipe(self.response);
    }
  });
}, { where: 'server' });


/**
 * Download file or ziped folder
 */
Router.route('/upload', function () {
  var self = this;
  var req = self.request;
  var res = self.response;

  if (req.method === 'POST') {
    var uploadDir = self.request.query.uploadDir;
    console.log(uploadDir);
    check(uploadDir, String);
    var realUploadDir = Path.join(rootDir, uploadDir);

    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var uploadTo = Path.join(realUploadDir, filename);

      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype + ', uploadTo', uploadTo);
      file.pipe(fs.createWriteStream(uploadTo));
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function() {
      console.log('Done upload file!');
      res.writeHead(303, { Connection: 'close', Location: '/' });
      res.end();
    });
    return req.pipe(busboy);
  }
  
}, { where: 'server' });