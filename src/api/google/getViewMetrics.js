import R from 'ramda';
import coreApi from '../google';
import getDateRanges from './getDateRanges';
import buildGaString from './buildGaString';

// redefineKeys :: { k: v } => { k: v }
const redefineKeys = R.compose(R.fromPairs, R.map(R.adjust(R.replace('ga:', ''), 0)), R.toPairs);

// extractData :: [{a: b}] => [{c: d}];
const extractData = R.map(R.compose(redefineKeys, R.prop('totalsForAllResults')));

// all :: [a] => Promise [b]
const all = R.bind(Promise.all, Promise);

// identityP :: a => Promise a
const identityP = R.bind(Promise.resolve, Promise);

const statsToNumbers = R.map(R.map(Number));

// getViewMetrics :: Date => [{k: v}]
export default (today: Date): Promise<any> => {
  const metrics = buildGaString(['sessions', 'users', 'pageviews']);
  const mergeAndApiCall = R.compose(coreApi, R.assoc('metrics', metrics));

  return R.composeP(
    statsToNumbers,
    extractData,
    all,
    R.map(mergeAndApiCall),
    getDateRanges,
    identityP,
  )(today);
};
