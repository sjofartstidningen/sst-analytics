const R = require('ramda');
const getDateRanges = require('../../../utils/getDateRanges');
const combineEqual = require('../../../utils/combineEqual');
const { identityP } = require('../../../utils');
const {
  constructRequest,
  constructMetricsArray,
  constructDimensionsArray,
  splitInPairs,
  getReport,
} = require('../utils');

const data = {
  metrics: constructMetricsArray(['pageviews']),
  dimensions: constructDimensionsArray(['source']),
  orderBys: [{ fieldName: 'ga:pageviews', sortOrder: 'DESCENDING' }],
};

const request = constructRequest(data);

const reorganizeData = R.applySpec({
  referrer: R.compose(R.head, R.prop('dimensions')),
  value: R.compose(Number, R.head, R.prop('values'), R.head, R.prop('metrics')),
  prev: R.compose(Number, R.head, R.prop('values'), R.last, R.prop('metrics')),
});

const regexp = /(?:\S+\.)*(\S+)(?:\.\S*)/; // matches eg. m.facebook.com || facebook.com -> facebook
const refLens = R.lensProp('referrer');
const renameReferrers = R.over(refLens, R.cond([
  [R.test(regexp), R.compose(R.nth(1), R.match(regexp))],
  [R.T, R.identity],
]));

const transformData = R.map(R.compose(renameReferrers, reorganizeData));

const propRef = R.prop('referrer');
const propVal = R.prop('value');
const propPre = R.prop('prev');

const equalityCheck = R.curry((currObj, prevObj) => {
  const currRef = propRef(currObj);
  const prevRef = propRef(prevObj);
  return R.equals(currRef, prevRef);
});

const combineFn = R.mergeWithKey((k, l, r) => {
  if (R.or(R.equals('value', k), R.equals('prev', k))) {
    return R.add(l, r);
  }
  return r;
});

const combine = combineEqual(equalityCheck, combineFn);

const applyDiff = R.map(obj => R.assoc(
  'diff',
  R.subtract(R.divide(propVal(obj), propPre(obj)), 1),
  obj,
));

module.exports = R.composeP(
  R.reverse,
  R.takeLast(5),
  R.sortBy(R.prop('value')),
  applyDiff,
  combine,
  transformData,
  getReport,
  request,
  R.head,
  splitInPairs,
  getDateRanges,
  identityP,
);
