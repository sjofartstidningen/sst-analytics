// @flow
/* eslint-disable no-undef */

declare type GAjwt = {
  authorize: () => void,
};

declare type GApayload = {
  auth: GAjwt,
  accountId: number,
  webPropertyId: string,
  profileId: number,
  ids: string,
  metrics: string,
  dimensions?: string,
  sort?: string,
  'max-results'?: number,
  'start-date': string,
  'end-date': string,
};

declare type GAdata = {
  start: Date,
  end: Date,
  metrics: string,
  dimensions?: string,
  sort?: string,
  maxResults?: number,
};

declare type GAmetrics = 'sessions' | 'pageviews' | 'users' | 'pagePath' | 'pageTitle' | 'source';
