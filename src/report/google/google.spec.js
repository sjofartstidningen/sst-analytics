const test = require('blue-tape');
const R = require('ramda');
const google = require('../google');

const propType = R.compose(R.type, R.prop);

test('REPORT: google', (t) => {
  const date = new Date(2016, 10, 10);
  return google(date)
    .then((res) => {
      const viewMetrics = R.prop('viewMetrics', res);
      const referrals = R.prop('referrals', res);
      const mostViews = R.prop('mostViews', res);

      {
        const week = R.prop('week', viewMetrics);

        const should = 'Should return a report containing viewMetrics';
        const actual = propType('sessions', week);
        const expected = 'Object';

        t.equal(actual, expected, should);
      }

      {
        const should = 'Should return a report containing referrals';
        const actual = R.length(referrals) <= 5;
        const expected = true;

        t.equal(actual, expected, should);
      }

      {
        const articles = R.prop('articles', mostViews);

        const should = 'Should return a report containing mostViews';
        const actual = R.length(articles) <= 5;
        const expected = true;

        t.equal(actual, expected, should);
      }
    });
});
