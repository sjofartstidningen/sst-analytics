import test from 'blue-tape';
import * as utils from '../utils';

test('Util: formatDate', (t) => {
  const should = 'Should return a date formatted YYYY-MM-DD from a date object';
  const actual = utils.formatDate(new Date(2000, 0, 1));
  const expected = '2000-01-01';

  t.equal(actual, expected, should);
  t.end();
});

test('Util: capitalizeFirst', (t) => {
  const should = 'Should return a string with first letter capitalized';
  const actual = utils.capitalizeFirst('foo');
  const expected = 'Foo';

  t.equal(actual, expected, should);
  t.end();
});
