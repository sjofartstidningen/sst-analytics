const test = require('blue-tape');
const R = require('ramda');
const referrals = require('../referrals');

test('REPORT: google.referrals', (t) => {
  const date = new Date(2016, 10, 10);
  return referrals(date)
    .then((res) => {
      const should = 'Should return an array of top five referrers';
      const actual = R.length(res) <= 5;
      const expected = true;

      t.equal(actual, expected, should);
    });
});
