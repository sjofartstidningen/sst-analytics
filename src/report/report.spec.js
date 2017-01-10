const test = require('blue-tape');
const R = require('ramda');
const report = require('../report');

const propType = R.compose(R.type, R.prop);

test('REPORT: report', (t) => {
  const date = new Date(2016, 11, 1);
  return report(date)
    .then((res) => {
      const should = 'Should return a report containing meta, mailchimp and google report';
      const actual = [propType('meta', res), propType('mailchimp', res), propType('google', res)];
      const expected = ['Object', 'Array', 'Object'];

      t.deepEqual(actual, expected, should);
    });
});
