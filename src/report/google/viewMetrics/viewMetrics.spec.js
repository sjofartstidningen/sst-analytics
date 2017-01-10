const test = require('blue-tape');
const R = require('ramda');
const viewMetrics = require('../viewMetrics');

const propType = R.compose(R.type, R.prop);

test('REPORT: google.viewMetrics', (t) => {
  const date = new Date(2016, 10, 10);
  return viewMetrics(date)
    .then((res) => {
      const week = R.prop('week', res);
      const year = R.prop('year', res);

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
    });
});
