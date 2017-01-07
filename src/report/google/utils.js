const R = require('ramda');
const getDateRanges = require('./getDateRanges');

const defaultViewId = '7009314';

const dateRanges = getDateRanges(new Date());
const dateRangesObj = {
  WEEK: [R.nth(0, dateRanges), R.nth(1, dateRanges)],
  YEAR: [R.nth(2, dateRanges), R.nth(3, dateRanges)],
};

const constructArrayFactory = field => R.map(R.compose(
  R.assoc(field, R.__, {}), // eslint-disable-line no-underscore-dangle
  R.concat('ga:'),
));

exports.constructMetricsArray = constructArrayFactory('expression');
exports.constructDimensionsArray = constructArrayFactory('name');

exports.constructRequest = (dateRange = 'WEEK', opts) => {
  const base = {
    viewId: defaultViewId,
    dateRanges: dateRangesObj[dateRange],
  };

  return Object.assign({}, base, opts);
};
