var fs = Npm.require('fs');
var Path = Npm.require('path');
var readdir = Meteor.npmRequire("readdir-plus");
var Mime = Meteor.npmRequire('mime');
var StatMode = Meteor.npmRequire('stat-mode');

var rootDir = Meteor.settings.private.rootDir;

fmStatDecode = function(stat) {
  var statMode = new StatMode(stat);
  var statDecoded = {};
  for (var name in statMode) {
    var value = statMode[name];
    if (_.isFunction(value)) {
      value = value.apply(statMode);
    }
    statDecoded[name] = value;
  }
  return statDecoded;
}

Meteor.methods({
  'fm.cur': function (path) {
    check(path, String);
    path = Path.resolve(rootDir, path);

    return Async.runSync(function (done) {
      fs.stat(path, function (err, stat) {
        done(err, stat ? fmStatDecode(stat) : null);
      });
    });
  },
  'fm.ls': function (path) {
    check(path, String);
    path = Path.resolve(rootDir, path);

    return Async.runSync(function (done) {
      readdir(path, {recursive: false, filter: { directory: true, symbolicLink: true, file: true }}, function (err, files) {
        files = _.map(files, function (file) {
          file.mime = Mime.lookup(file.relativePath);
          file.relativePath = './' + Path.relative(rootDir, Path.join(path, file.relativePath));
          file.statDecoded = fmStatDecode(file.stat);
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
  },
  'fm.rm': function (path, type) {
    check(path, String);
    path = Path.resolve(rootDir, path);
    type = type || 'file';

    return Async.runSync(function (done) {
      if (type === 'file') {
        fs.unlink(path, done);  
      } else {
        fs.rmdir(path, done);
      }
    });
  },
  'fm.mkdir': function (path) {
    check(path, String);
    path = Path.resolve(rootDir, path);

    return Async.runSync(function (done) {
      fs.mkdir(path, Meteor.settings.private.newDirMode || 0777, done);
    });
  }
});