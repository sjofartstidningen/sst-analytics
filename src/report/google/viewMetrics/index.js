const Promise = require('bluebird');
const R = require('ramda');
const getDateRanges = require('../../../utils/getDateRanges');
const { identityP } = require('../../../utils');
const {
  constructRequest,
  constructMetricsArray,
  mapSeries,
  splitInPairs,
} = require('../utils');

const getMetrics = R.compose(R.prop('totals'), R.prop('data'), R.prop(0), R.prop('reports'));
const getCurrent = R.curry((nth, obj) => R.compose(R.nth(nth), R.prop('values'), R.nth(0))(obj));
const getPrevious = R.curry((nth, obj) => R.compose(R.nth(nth), R.prop('values'), R.nth(1))(obj));

const getDiff = R.curry((nth, metrics) => {
  const curr = getCurrent(nth, metrics);
  const prev = getPrevious(nth, metrics);
  return R.subtract(R.divide(curr, prev), 1);
});

const applyMetrics = R.applySpec({
  sessions: { total: getCurrent(0), diff: getDiff(0) },
  users: { total: getCurrent(1), diff: getDiff(1) },
  pageviews: { total: getCurrent(2), diff: getDiff(2) },
});

const extractData = R.compose(applyMetrics, getMetrics, R.prop('data'));

const splitToKeys = R.applySpec({ week: R.head, year: R.last });
const metrics = constructMetricsArray(['sessions', 'users', 'pageviews']);
const mapPromise = mapSeries(R.composeP(extractData, constructRequest({ metrics })));

// viewMetrics :: date -> a
module.exports = R.composeP(
  splitToKeys,
  mapPromise,
  splitInPairs,
  getDateRanges,
  identityP,
);
