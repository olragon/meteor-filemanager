Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {

  this.route('home', {
    path: '/',
    data: function () {
      var currentDir = this.params.query.currentDir || './';
      Session.set('rootDir', currentDir);
      return {
        rootDir: currentDir,
      }
    },
    onAfterAction: function () {
      Session.set('readFile', null);
    }
  });

});