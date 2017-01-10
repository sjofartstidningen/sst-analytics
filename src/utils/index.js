const format = require('date-fns/format');
const R = require('ramda');

exports.formatDate = date => format(date, 'YYYY-MM-DD');
exports.capitalizeFirst = R.compose(
  R.join(''),
  R.over(R.lensIndex(0), R.toUpper),
  R.split(''),
);

exports.identityP = R.bind(Promise.resolve, Promise);

exports.constructFields = prefix => R.compose(R.join(','), R.map(R.concat(prefix)));
