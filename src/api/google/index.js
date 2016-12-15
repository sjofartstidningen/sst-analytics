// @flow
import google from 'googleapis';
import { promisify } from 'bluebird';
import R from 'ramda';

import auth from './auth';
import getDateRanges from './getDateRanges';
import { formatDate } from '../../utils';
import { GA_ACCOUNT_ID, GA_WEB_PROPERTY, GA_PROFILE_ID, CLIENT_EMAIL, PRIVATE_KEY } from '../../env';

const analytics = promisify(google.analytics('v3').data.ga.get);

export const coreApi = async ({ start, end, metrics, dimensions, sort }: GAdata): Promise<any> => {
  try {
    const payload: GApayload = {
      auth: await auth(CLIENT_EMAIL, PRIVATE_KEY),
      accountId: GA_ACCOUNT_ID,
      profileId: GA_PROFILE_ID,
      webPropertyId: GA_WEB_PROPERTY,
      ids: `ga:${GA_PROFILE_ID}`,
      'start-date': formatDate(start),
      'end-date': formatDate(end),
      'max-results': 50,
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

// buildMetricsString :: <String> => String
const buildMetricsString = R.compose(R.join(','), R.map(R.concat('ga:')));

// redefineKeys :: { k: v } => { k: v }
const redefineKeys = R.compose(R.fromPairs, R.map(R.adjust(R.replace('ga:', ''), 0)), R.toPairs);

// extractData :: <{a: b}> => <{c: d}>;
const extractData = R.map(R.compose(redefineKeys, R.prop('totalsForAllResults')));

type GAmetrics = 'sessions' | 'pageviews' | 'users';
export const getViewMetrics = async (...metricsArr: Array<GAmetrics>): Promise<any> => {
  try {
    const metrics = buildMetricsString(metricsArr);
    const dateRanges = getDateRanges(new Date());

    const promises = dateRanges.map(({ end, start }) => coreApi({ end, start, metrics }));
    const result = await Promise.all(promises);
    const data = extractData(result);
    return data;
  } catch (err) {
    throw err;
  }
};

//   const mostViews = await getMostViews({
//     start,
//     end,
//     metrics: 'ga:pageviews',
//     dimensions: 'ga:pagePath,ga:pageTitle',
//     sort: '-ga:pageviews',
//   });
//
//   const referrals = await getReferrals({
//     start,
//     end,
//     metrics: 'ga:sessions',
//     dimensions: 'ga:source',
//     sort: '-ga:sessions',
//   });
