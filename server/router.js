var fs = Npm.require('fs');
var Path = Npm.require('path');

var Archiver = Meteor.npmRequire('archiver');
var Mime = Meteor.npmRequire('mime');

var rootDir = Meteor.settings.private.rootDir;


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