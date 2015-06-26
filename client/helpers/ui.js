UI.registerHelper('encodeUri', function (val) {
  return encodeURIComponent(val);
});

UI.registerHelper('numeral', function (val, format) {
  return numeral(val).format(format);
});