const R = require('ramda');
const coreApi = require('../google');
const { constructRequest, constructMetricsArray, constructDimensionsArray } = require('./utils');

const getReport = R.compose(R.prop('rows'), R.prop('data'), R.prop(0), R.prop('reports'));
const reorganizeData = R.applySpec({
  referrer: R.compose(R.head, R.prop('dimensions')),
  value: R.compose(Number, R.head, R.prop('values'), R.head, R.prop('metrics')),
  prev: R.compose(Number, R.head, R.prop('values'), R.last, R.prop('metrics')),
  diff: (item) => {
    const currValue = R.compose(Number, R.head, R.prop('values'), R.head, R.prop('metrics'))(item);
    const prevValue = R.compose(Number, R.head, R.prop('values'), R.last, R.prop('metrics'))(item);

    if (prevValue === 0) return -1;
    return R.subtract(R.divide(currValue, prevValue), 1);
  },
});

const regexp = /(?:\S+\.)*(\S+)(?:\.\S*)/; // matches eg. m.facebook.com || facebook.com -> facebook
const refLens = R.lensProp('referrer');
const renameReferrers = R.over(refLens, R.cond([
  [R.test(regexp), R.compose(R.nth(1), R.match(regexp))],
  [R.T, R.identity],
]));

const propRef = R.prop('referrer');
const propVal = R.prop('value');
const propPre = R.prop('prev');

const combineEqual = R.reduce((acc, curr) => {
  const currRef = propRef(curr);
  const index = R.findIndex(R.propEq('referrer', currRef), acc);

  if (index === -1) return R.append(curr, acc);

  const indexLens = R.lensIndex(index);
  const existing = R.nth(index, acc);

  const value = R.add(propVal(existing), propVal(curr));
  const prev = R.add(propPre(existing), propPre(curr));

  const newObj = {
    referrer: propRef(existing),
    value,
    prev,
    diff: R.subtract(R.divide(value, prev), 1),
  };

  return R.over(indexLens, R.always(newObj), acc);
}, []);

const extractData = R.compose(
  R.reverse,
  R.takeLast(5),
  R.sortBy(R.prop('value')),
  combineEqual,
  R.map(R.compose(renameReferrers, reorganizeData)),
  getReport,
);

module.exports = async (range) => {
  const result = await coreApi([
    constructRequest(range, {
      metrics: constructMetricsArray(['pageviews']),
      dimensions: constructDimensionsArray(['source']),
      orderBys: [
        {
          fieldName: 'ga:pageviews',
          sortOrder: 'DESCENDING',
        },
      ],
    }),
  ]);

  return extractData(result);
};
