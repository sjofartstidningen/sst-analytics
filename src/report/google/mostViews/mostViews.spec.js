const test = require('blue-tape');
const R = require('ramda');
const mostViews = require('../mostViews');

test('REPORT: google.mostViews', (t) => {
  const date = new Date(2016, 10, 10);
  return mostViews(date)
    .then((res) => {
      const articles = R.prop('articles', res);
      const jobs = R.prop('jobs', res);

      const should = 'Should return two arrays of most viewed articles and most viewed jobs';
      const actual = [R.length(articles) <= 5, R.length(jobs) <= 5];
      const expected = [true, true];

      t.deepEqual(actual, expected, should);
    });
});
