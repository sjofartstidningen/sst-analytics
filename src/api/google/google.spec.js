import test from 'blue-tape';
import R from 'ramda';
import auth from './auth';
import coreApi from '../google';
import report from './report';

const propType = R.compose(R.type, R.prop);

test('API: google.auth', async (t) => {
  const result = await auth();

  const should = 'Should return an object with access token, access type and expiry';
  const actual = [propType('access_token', result), propType('token_type', result), propType('expires_in', result)];
  const expected = ['String', 'String', 'Number'];

  t.deepEqual(actual, expected, should);
});

test('API: google.coreApi', async (t) => {
  const mockRequestBody = [
    {
      viewId: '7009314',
      dateRanges: [{ startDate: '2016-11-01', endDate: '2016-11-30' }],
      metrics: [{ expression: 'ga:users' }],
    },
  ];

  const result = await coreApi(mockRequestBody);

  {
    const should = 'Should return a response from Google Analytics';
    const actual = Array.isArray(result.reports);
    const expected = true;

    t.equal(actual, expected, should);
  }
});

test('API: google.report', async (t) => {
  const result = await report();

  {
    const should = 'Should return an object with keys representing data';
    const actual = [propType('viewMetrics', result), propType('referrals', result), propType('mostViews', result)];
    const expected = ['Object', 'Array', 'Object'];

    t.deepEqual(actual, expected, should);
  }

  {
    const viewMetrics = R.prop('viewMetrics', result);
    const week = R.prop('week', viewMetrics);
    const year = R.prop('year', viewMetrics);

    const should = 'Should contain viewMetrics about sessions, users and pageviews';
    const actual = [
      propType('sessions', week), propType('users', week), propType('pageviews', week),
      propType('sessions', year), propType('users', year), propType('pageviews', year),
    ];
    const expected = [
      'Object', 'Object', 'Object',
      'Object', 'Object', 'Object',
    ];

    t.deepEqual(actual, expected, should);
  }

  {
    const referrals = R.prop('referrals', result);

    const should = 'Should return an array of top five referrers';
    const actual = R.length(referrals) <= 5;
    const expected = true;

    t.equal(actual, expected, should);
  }

  {
    const mostViews = R.prop('mostViews', result);
    const articles = R.prop('articles', mostViews);
    const jobs = R.prop('jobs', mostViews);

    const should = 'Should return two arrays of most viewed articles and most viewd jobs';
    const actual = [R.length(articles) <= 5, R.length(jobs) <= 5];
    const expected = [true, true];

    t.deepEqual(actual, expected, should);
  }
});
