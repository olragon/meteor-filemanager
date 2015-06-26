var fs = Npm.require('fs');
var Path = Npm.require('path');
var readdir = Meteor.npmRequire("readdir-plus");
var Mime = Meteor.npmRequire('mime');

var rootDir = Meteor.settings.private.rootDir;

Meteor.methods({
  'fm.ls': function (path) {
    check(path, String);
    path = Path.resolve(rootDir, path);

    return Async.runSync(function (done) {
      readdir(path, {recursive: false, filter: { directory: true, symbolicLink: true, file: true }}, function (err, files) {
        files = _.map(files, function (file) {
          file.mime = Mime.lookup(file.relativePath);
          file.relativePath = './' + Path.relative(rootDir, Path.join(path, file.relativePath));
          return file;
        });
        done(err, files);
      });
    });
  },
  'fm.read': function (path) {
    check(path, String);
    path = Path.resolve(rootDir, path);

    return Async.runSync(function (done) {
      fs.readFile(path, function (err, content) {
        done(err, content.toString());
      });
    });
  }
});