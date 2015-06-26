Template.home.helpers({
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
  }
});

Template.home.rendered = function () {
  $('#preview iframe').css({ height: $('body').height() });
  $('#preview #mandrill_ace').css({ height: $('body').height() });
}

Deps.autorun(function () {
  var rootDir = Session.get('rootDir') || './';
  Meteor.call('fm.ls', rootDir, function (err, result) {
    Session.set('ls', result.result);
  });
});