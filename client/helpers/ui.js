canUseEditor = function (file) {
  if (file.mime.match(/text/)) {
    return true;
  }
  if (file.extension.match(/php|js|json/)) {
    return true;
  }
  if (file.stat.size < 2 * 1000000) {
    return true;
  }
  return false;
}

UI.registerHelper('encodeUri', function (val) {
  return encodeURIComponent(val);
});

UI.registerHelper('numeral', function (val, format) {
  return numeral(val).format(format);
});

UI.registerHelper('$match', function (input, pattern) {
  var regex = new RegExp(pattern);
  return regex.test(input);
});

UI.registerHelper('canUseEditor', function (file) {
  return canUseEditor(file);
});