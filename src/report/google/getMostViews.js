import R from 'ramda';
import coreApi from '../google';
import { constructRequest, constructMetricsArray, constructDimensionsArray } from './utils';

const getReport = R.compose(R.prop('rows'), R.prop('data'), R.prop(0), R.prop('reports'));

const renameTitle = R.compose(R.trim, R.replace(/\|/g, ''), R.replace(/Sjöfartstidningen/g, ''));

const isJobs = R.compose(R.test(/^\/jobb\//), R.prop('url'));
const isNotJobs = R.complement(isJobs);
const isRoot = R.compose(R.test(/^\/$/), R.prop('url'));
const isNotRoot = R.complement(isRoot);
const isNews = R.compose(R.test(/^\/nyheter\/$/), R.prop('url'));
const isNotNews = R.complement(isNews);

const allPassArticles = R.allPass([isNotJobs, isNotRoot, isNotNews]);
const allPassJobs = R.allPass([isJobs]);

const reorganizeData = R.applySpec({
  url: R.compose(R.head, R.prop('dimensions')),
  title: R.compose(renameTitle, R.last, R.prop('dimensions')),
  views: R.compose(Number, R.head, R.prop('values'), R.head, R.prop('metrics')),
});

const filterSortAndTake5 = predicateFn => R.compose(R.reverse, R.takeLast(5), R.sortBy(R.prop('views')), R.filter(predicateFn));

const splitInCategories = R.applySpec({
  articles: filterSortAndTake5(allPassArticles),
  jobs: filterSortAndTake5(allPassJobs),
});

const extractData = R.compose(
  splitInCategories,
  R.map(reorganizeData),
  getReport,
);

export default async (range) => {
  const result = await coreApi([
    constructRequest(range, {
      metrics: constructMetricsArray(['pageviews']),
      dimensions: constructDimensionsArray(['pagePath', 'pageTitle']),
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
