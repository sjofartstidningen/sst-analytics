// @flow
import google from 'googleapis';
import { promisify } from 'bluebird';
import format from 'date-fns/format';
import auth from './auth';

const analytics = google.analytics('v3');
const analyticsGet = promisify(analytics.data.ga.get);

const formatDate = (date: Date): string => format(date, 'YYYY-MM-DD');

const {
  GA_ACCOUNT_ID,
  GA_WEB_PROPERTY,
  GA_PROFILE,
  CLIENT_EMAIL,
  PRIVATE_KEY,
} = process.env;

if (!GA_ACCOUNT_ID || !GA_WEB_PROPERTY || !GA_PROFILE || !CLIENT_EMAIL || !PRIVATE_KEY) {
  throw new Error('Necessary environment variables is not set');
}

const accountId = Number(GA_ACCOUNT_ID);
const profileId = Number(GA_PROFILE);
if (isNaN(accountId)) throw new Error('Environment variable GA_ACCOUNT_ID must be a number');
if (isNaN(profileId)) throw new Error('Environment variable GA_PROFILE must be a number');

type GAdata = {
  start: Date,
  end: Date,
  metrics: string,
  dimensions?: string,
  sort?: string,
};

export default async ({ start, end, metrics, dimensions, sort }: GAdata): Promise<any> => {
  let jwt;

  try {
    jwt = await auth(CLIENT_EMAIL, PRIVATE_KEY);
  } catch (err) {
    throw err;
  }

  const payload: GApayload = {
    auth: jwt,
    accountId,
    webPropertyId: GA_WEB_PROPERTY,
    profileId,
    ids: `ga:${GA_PROFILE}`,
    'start-date': formatDate(start),
    'end-date': formatDate(end),
    'max-results': 20,
    metrics,
  };

  if (dimensions) payload.dimensions = dimensions;
  if (sort) payload.sort = sort;

  let result;

  try {
    result = await analyticsGet(payload);
  } catch (err) {
    throw err;
  }

  return result;
};
