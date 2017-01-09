const R = require('ramda');
const Promise = require('bluebird');
const google = require('../../api/google');
const config = require('../../config');

const constructArrayFactory = field => R.map(R.compose(
  R.assoc(field, R.__, {}), // eslint-disable-line no-underscore-dangle
  R.concat('ga:'),
));

exports.constructMetricsArray = constructArrayFactory('expression');
exports.constructDimensionsArray = constructArrayFactory('name');

exports.constructRequest = R.curry((opts, dateRanges) => {
  const base = {
    viewId: `${config('GA_PROFILE_ID')}`,
    dateRanges,
  };

  const data = { reportRequests: [Object.assign({}, base, opts)] };

  return google.post('/', data);
});

exports.splitInPairs = R.splitEvery(2);
exports.mapSeries = R.flip(R.curry(Promise.mapSeries));

exports.getReport = R.compose(R.prop('rows'), R.prop('data'), R.prop(0), R.prop('reports'), R.prop('data'));
