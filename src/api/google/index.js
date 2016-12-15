// @flow
import google from 'googleapis';
import { promisify } from 'bluebird';
import R from 'ramda';

import auth from './auth';
import getDateRanges from './getDateRanges';
import { formatDate, capitalizeFirst } from '../../utils';
import env from '../../env';

const analytics = promisify(google.analytics('v3').data.ga.get);

const CLIENT_EMAIL = env('CLIENT_EMAIL');
const PRIVATE_KEY = env('PRIVATE_KEY');
const GA_ACCOUNT_ID = env('GA_ACCOUNT_ID');
const GA_PROFILE_ID = env('GA_PROFILE_ID');
const GA_WEB_PROPERTY = env('GA_WEB_PROPERTY');

export const coreApi = async (
  { start, end, metrics, dimensions, sort }: GAdata,
): Promise<any> => {
  try {
    const payload: GApayload = {
      auth: await auth(CLIENT_EMAIL, PRIVATE_KEY),
      accountId: Number(GA_ACCOUNT_ID),
      profileId: Number(GA_PROFILE_ID),
      webPropertyId: GA_WEB_PROPERTY,
      ids: `ga:${GA_PROFILE_ID}`,
      'start-date': formatDate(start),
      'end-date': formatDate(end),
      metrics,
    };

    if (dimensions) payload.dimensions = dimensions;
    if (sort) payload.sort = sort;

    const result = await analytics(payload);
    return result;
  } catch (err) {
    throw err;
  }
};

// buildGaString :: [String] => String
const buildGaString = (metricsArr: Array<GAmetrics>) => (
  R.compose(R.join(','), R.map(R.concat('ga:')))(metricsArr)
);

// redefineKeys :: { k: v } => { k: v }
const redefineKeys = R.compose(R.fromPairs, R.map(R.adjust(R.replace('ga:', ''), 0)), R.toPairs);

// extractData :: [{a: b}] => [{c: d}];
const extractData = R.map(R.compose(redefineKeys, R.prop('totalsForAllResults')));

// all :: [a] => Promise [b]
const all = R.bind(Promise.all, Promise);

// identityP :: a => Promise a
const identityP = R.bind(Promise.resolve, Promise);

// getViewMetrics :: (Date, [String]) => [{k: v}]
export const getViewMetrics = (today: Date, metricsArr: Array<GAmetrics>): Promise<any> => {
  const metrics = buildGaString(metricsArr);
  const mergeAndApiCall = R.compose(coreApi, R.assoc('metrics', metrics));

  return R.composeP(extractData, all, R.map(mergeAndApiCall), getDateRanges, identityP)(today);
};


// generalPattern :: String => Boolean
const generalPattern = R.complement(R.anyPass([
  R.test(/^\/$/),
  R.test(/^\/nyheter\/$/),
  R.test(/^\/jobb\//),
  R.test(/^\/jobb-karriar\/folk-pa-vag\/$/),
  R.test(/^\/bloggar\/$/),
]));

// jobPattern :: String => Boolean
const jobPattern = R.anyPass([R.test(/^\/jobb\//)]);

// renamer :: String => String
const renamer = R.over(R.lensIndex(1), R.compose(R.trim, R.replace(/\|/g, ''), R.replace(/Sjöfartstidningen/g, '')));

const spec = {
  top: R.compose(R.map(renamer), R.take(5), R.filter(R.compose(generalPattern, R.head))),
  jobs: R.compose(R.map(renamer), R.take(5), R.filter(R.compose(jobPattern, R.head))),
};

// callAndExtractMostViews :: Payload => Promise {k: v}
const callAndExtractMostViews = R.composeP(R.applySpec(spec), R.prop('rows'), coreApi);

// getMostViews :: Date => Promise {k: v}
export const getMostViews = async (today: Date): Promise<any> => {
  const payload = R.compose(
    R.assoc('sort', '-ga:pageviews'),
    R.assoc('dimensions', buildGaString(['pagePath', 'pageTitle'])),
    R.assoc('metrics', buildGaString(['pageviews'])),
    R.head,
    getDateRanges,
  )(today);

  try {
    const result = await callAndExtractMostViews(payload);
    return result;
  } catch (err) {
    throw err;
  }
};


const regexp = /(?:\S+\.)*(\S+)(?:\.\S*)/; // matches eg. m.facebook.com || facebook.com -> facebook

// renameOnMatch :: String -> String
const renameOnMatch = R.cond([
  [R.test(regexp), R.compose(R.nth(1), R.match(regexp))],
  [R.test(/^\((\S+)\)$/), R.compose(R.nth(1), R.match(/^\((\S+)\)$/))],
  [R.T, R.identity],
]);

// renameReferrer :: [key, value] -> [key, value]
const renameReferrer = R.over(R.lensIndex(0), R.compose(capitalizeFirst, renameOnMatch));

// numberToNumber :: [key, value] -> [key, value]
const numberToNumber = R.over(R.lensIndex(1), Number);

// mergeSimilarReferrals :: [[k, a], [k, b] ...] -> [[k, b], [k, a] ...]
const mergeSimilarReferrals = R.compose(
  R.reverse,
  R.sortBy(R.prop(1)),
  R.toPairs,
  R.reduce(R.mergeWith(R.add), {}),
  R.reduce((acc, arr) => R.append({ [arr[0]]: arr[1] }, acc), []),
);

// callAndExtractReferrals :: Payload => Promise [k, v]
const callAndExtractReferrals = R.composeP(
  R.take(5),
  mergeSimilarReferrals,
  R.map(R.compose(numberToNumber, renameReferrer)),
  R.prop('rows'),
  coreApi,
);

// getReferrals :: Date => Promise [k, v]
export const getReferrals = async (today: Date): Promise<Array<Array<string | number>>> => {
  const payload = R.compose(
    R.assoc('sort', '-ga:pageviews'),
    R.assoc('dimensions', buildGaString(['source'])),
    R.assoc('metrics', buildGaString(['pageviews'])),
    R.head,
    getDateRanges,
  )(today);

  try {
    const result = await callAndExtractReferrals(payload);
    return result;
  } catch (err) {
    throw err;
  }
};
