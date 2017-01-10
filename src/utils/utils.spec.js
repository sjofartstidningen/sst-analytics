const test = require('blue-tape');
const R = require('ramda');
const utils = require('../utils');
const getDateRanges = require('./getDateRanges');
const combineEqual = require('./combineEqual');

test('Utils: formatDate', (t) => {
  const should = 'Should return a date formatted YYYY-MM-DD from a date object';
  const actual = utils.formatDate(new Date(2000, 0, 1));
  const expected = '2000-01-01';

  t.equal(actual, expected, should);
  t.end();
});

test('Utils: capitalizeFirst', (t) => {
  const should = 'Should return a string with first letter capitalized';
  const actual = utils.capitalizeFirst('foo');
  const expected = 'Foo';

  t.equal(actual, expected, should);
  t.end();
});

test('Utils: getDateRanges', (t) => {
  const result = getDateRanges(new Date(2017, 0, 0));

  {
    const should = 'Should return an array of date ranges';
    const actual = Array.isArray(result);
    const expected = true;

    t.equal(actual, expected, should);
  }

  {
    const should = 'Should return current week as first object in array';
    const actual = R.head(result);
    const expected = { endDate: '2016-12-25', startDate: '2016-12-19' };

    t.deepEqual(actual, expected, should);
  }

  {
    const should = 'Should return last week as second object in array';
    const actual = R.nth(1, result);
    const expected = { endDate: '2016-12-18', startDate: '2016-12-12' };

    t.deepEqual(actual, expected, should);
  }

  {
    const should = 'Should return current year as second object in array';
    const actual = R.nth(2, result);
    const expected = { endDate: '2016-12-25', startDate: '2015-12-25' };

    t.deepEqual(actual, expected, should);
  }

  {
    const should = 'Should return previous year as second object in array';
    const actual = R.last(result);
    const expected = { endDate: '2015-12-25', startDate: '2014-12-25' };

    t.deepEqual(actual, expected, should);
  }

  t.end();
});

test('Utils: combineEqual', (t) => {
  const array = [
    { provider: 'Twitter', clicks: 10 },
    { provider: 'Facebook', clicks: 50 },
    { provider: 'twitter', clicks: 12 },
  ];

  const equalityCheck = R.curry((currentObj, previousObj) => {
    const currentProvider = R.toUpper(R.prop('provider', currentObj));
    const previousProvider = R.toUpper(R.prop('provider', previousObj));

    return R.equals(currentProvider, previousProvider);
  });

  const combineFn = R.mergeWithKey((k, l, r) => (k === 'clicks' ? R.add(l, r) : r));


  const should = 'Should combine equal object in an array';
  const actual = combineEqual(equalityCheck, combineFn, array);
  const expected = [
    { provider: 'Twitter', clicks: 22 },
    { provider: 'Facebook', clicks: 50 },
  ];

  t.deepEqual(actual, expected, should);
  t.end();
});
