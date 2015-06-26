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
  }
});

Deps.autorun(function () {
  var rootDir = Session.get('rootDir') || './';
  Meteor.call('fm.ls', rootDir, function (err, result) {
    console.log(result.result);
    Session.set('ls', result.result);
  });
});