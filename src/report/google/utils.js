import R from 'ramda';
import getDateRanges from './getDateRanges';

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

export const constructMetricsArray = constructArrayFactory('expression');
export const constructDimensionsArray = constructArrayFactory('name');

export const constructRequest = (dateRange = 'WEEK', opts) => {
  const base = {
    viewId: defaultViewId,
    dateRanges: dateRangesObj[dateRange],
  };

  return Object.assign({}, base, opts);
};
