// @flow
import google from 'googleapis';
import { promisify } from 'bluebird';

import auth from './auth';
import { formatDate } from '../../utils';
import env from '../../env';

const analytics = promisify(google.analytics('v3').data.ga.get);

const GA_CLIENT_EMAIL = env('GA_CLIENT_EMAIL');
const GA_PRIVATE_KEY = env('GA_PRIVATE_KEY');
const GA_ACCOUNT_ID = env('GA_ACCOUNT_ID');
const GA_PROFILE_ID = env('GA_PROFILE_ID');
const GA_WEB_PROPERTY = env('GA_WEB_PROPERTY');

export default async (
  { start, end, metrics, dimensions, sort }: GAdata,
): Promise<any> => {
  try {
    const payload: GApayload = {
      auth: await auth(GA_CLIENT_EMAIL, GA_PRIVATE_KEY),
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
