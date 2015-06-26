readDir = function (rootDir) {
  Meteor.call('fm.ls', rootDir, function (err, result) {
    console.log('readDir', rootDir, result.result);
    Session.set('ls', result.result);
  });
}

Template.home.helpers({
  'curDir': function () {
    return Session.get('curDir');
  },
  'ls': function () {
    return Session.get('ls') || [];
  },
  'breadcrumb': function () {
    var rootDir = Session.get('rootDir') || './';
    var lastPath = [];
    var items = [];

    _.each(rootDir.split('/'), function (dir) {
      lastPath.push(dir);

      var item =  {
        name: dir,
        path: lastPath.join('/'),
      };
      
      items.push(item);
    });

    return items;
  },
  readFile: function () {
    return Session.get('readFile');
  },
  uploadData: function () {
    return {
      uploadUrl: '/upload/?uploadDir=' + Session.get('rootDir')
    };
  }
});

Template.home.events({
  'click a.view': function (evt) {
    var path = $(evt.currentTarget).data('path');

    var file = _.find(Session.get('ls'), function (file) {
      return file.relativePath == path;
    });

    console.log('viewFile', path, file);

    Session.set('readFile', file);
    return false;
  },
  'change input.search, keypress input.search': function (evt) {
    var files = Session.get('ls');
    files = _.map(files, function (file) {
      if (evt.currentTarget.value && file.relativePath.indexOf(evt.currentTarget.value) < 0) {
        file._hide = true;
      } else {
        delete file._hide;
      }
      return file;
    });
    Session.set('ls', files);
  },
  'click .upload': function () {
    Session.set('ui.showUpload', !(Session.get('ui.showUpload') || false));
    return false;
  },
  'click a.delete': function (evt) {
    var $a = $(evt.currentTarget);
    if (confirm('Delete ' + $a.data('path'))) {
      Meteor.call('fm.rm', $a.data('path'), $a.data('type'), function (err) {
        if (!err) {
          readDir(Session.get('rootDir'));
        } else {
          alert(err);
        }
      });
    }
    return false;
  },
  'click .newDir': function () {
    Session.set('newDir', !Session.get('newDir'));
    return false;
  },
  'keypress input.newFolderName': function (evt) {
    if (evt.currentTarget.value && evt.which === 13) {
      Meteor.call('fm.mkdir', evt.currentTarget.value, function (err) {
        if (!err) {
          readDir(Session.get('rootDir'));
          Session.set('newDir', false);
        }
      });
      return false;
    }
  }
});

Template.home.rendered = function () {
  $('#preview iframe').css({ height: $('body').height() });
  $('#preview #mandrill_ace').css({ height: $('body').height() });
}

Deps.autorun(function () {
  var rootDir = Session.get('rootDir') || './';
  readDir(rootDir);
  Meteor.call('fm.cur', rootDir, function (err, result) {
    if (err) return;
    console.log(rootDir, result.result);
    Session.set('curDir', result.result);
  });
});