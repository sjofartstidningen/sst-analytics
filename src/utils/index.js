const format = require('date-fns/format');
const R = require('ramda');

exports.formatDate = date => format(date, 'YYYY-MM-DD');
exports.capitalizeFirst = str => R.compose(
  R.join(''),
  R.over(R.lensIndex(0), R.toUpper),
  R.split(''),
)(str);
