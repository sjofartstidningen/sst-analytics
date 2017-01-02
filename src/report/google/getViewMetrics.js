import R from 'ramda';
import coreApi from '../google';
import { constructRequest, constructMetricsArray } from './utils';

const getMetrics = R.compose(R.prop('totals'), R.prop('data'), R.prop(0), R.prop('reports'));
const getCurrent = R.curry((nth, obj) => R.compose(R.nth(nth), R.prop('values'), R.nth(0))(obj));
const getPrevious = R.curry((nth, obj) => R.compose(R.nth(nth), R.prop('values'), R.nth(1))(obj));

const getDiff = R.curry((nth, metrics) => {
  const curr = getCurrent(nth, metrics);
  const prev = getPrevious(nth, metrics);
  return R.subtract(R.divide(curr, prev), 1);
});

const applyMetrics = R.applySpec({
  sessions: {
    total: getCurrent(0),
    diff: getDiff(0),
  },
  users: {
    total: getCurrent(1),
    diff: getDiff(1),
  },
  pageviews: {
    total: getCurrent(2),
    diff: getDiff(2),
  },
});

export default async (range) => {
  const result = await coreApi([
    constructRequest(range, {
      metrics: constructMetricsArray(['sessions', 'users', 'pageviews']),
    }),
  ]);

  const metrics = getMetrics(result);

  return applyMetrics(metrics);
};
