Meteor.Dropzone.options = {
  init: function () {
    var self = this;

    this.on('complete', function () {
      readDir(Session.get('rootDir') || './');
    });
    console.log(self.options)
    Deps.autorun(function () {
      self.options.url = '/upload/?uploadDir=' + Session.get('rootDir');
    });
  }
};

Template.upload.helpers({
  showUpload: function () {
    return Session.get('ui.showUpload');
  }
});

Template.upload.rendered = function () {
  
}