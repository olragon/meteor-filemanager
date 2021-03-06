Template.editor.helpers({
  mode: function () {
    var mode = MandrillAce.getInstance().mode();
    return mode;
  },
  file: function () {
    return Session.get('readFile');
  },
  isHidden: function () {
    return Session.get('readFile') ? '' : 'hide';
  }
});

Template.editor.rendered = function () {
  var self = this;
  MandrillAce.getInstance().setTheme('ace/theme/monokai');

  Deps.autorun(function () {
    var file = Session.get('readFile');
    if (!file) return;

    var path = file.relativePath;
    var editor = MandrillAce.getInstance();

    if (path && editor && canUseEditor(file)) {
      Meteor.call('fm.read', path, function (err, output) {
        if (!err) {
          editor.detectMode(path);
          editor.setValue(output.result, -1);
        }
      });
    }
  });
}

Template.editor_pdf.rendered = function () {
  $(this.find('iframe')).height($(document).height());
}