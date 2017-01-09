const R = require('ramda');
const getDateRanges = require('../../../utils/getDateRanges');
const { identityP } = require('../../../utils');
const {
  splitInPairs,
  constructMetricsArray,
  constructDimensionsArray,
  constructRequest,
  getReport,
} = require('../utils');

const data = {
  metrics: constructMetricsArray(['pageviews']),
  dimensions: constructDimensionsArray(['pagePath', 'pageTitle']),
  orderBys: [{ fieldName: 'ga:pageviews', sortOrder: 'DESCENDING' }],
};

const request = constructRequest(data);

const renameTitle = R.compose(R.trim, R.replace(/\|/g, ''), R.replace(/Sjöfartstidningen/g, ''));
const reorganizeData = R.map(R.applySpec({
  url: R.compose(R.head, R.prop('dimensions')),
  title: R.compose(renameTitle, R.last, R.prop('dimensions')),
  views: R.compose(Number, R.head, R.prop('values'), R.head, R.prop('metrics')),
}));

const isJobs = R.compose(R.test(/^\/jobb\//), R.prop('url'));
const isNotJobs = R.complement(isJobs);
const isNotRoot = R.complement(R.compose(R.test(/^\/$/), R.prop('url')));
const isNotNews = R.complement(R.compose(R.test(/^\/nyheter\/$/), R.prop('url')));

const allPassArticles = R.allPass([isNotJobs, isNotRoot, isNotNews]);
const allPassJobs = R.allPass([isJobs]);
const filterSortAndTake5 = predicateFn => R.compose(R.reverse, R.takeLast(5), R.sortBy(R.prop('views')), R.filter(predicateFn));

const splitInCategories = R.applySpec({
  articles: filterSortAndTake5(allPassArticles),
  jobs: filterSortAndTake5(allPassJobs),
});

module.exports = R.composeP(
  splitInCategories,
  reorganizeData,
  getReport,
  request,
  R.head,
  splitInPairs,
  getDateRanges,
  identityP,
);
