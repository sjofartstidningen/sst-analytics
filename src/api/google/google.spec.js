import test from 'blue-tape';
import R from 'ramda';
import getMostViews from './getMostViews';
import getViewMetrics from './getViewMetrics';
import getReferrals from './getReferrals';

test('API: google.getMostViews', async (t) => {
  const result = await getMostViews(new Date());
  const getTypes = R.map(R.type);

  {
    const should = 'Should return most viewed articles';
    const actual = R.compose(Array.isArray, R.prop('top'))(result);
    const expected = true;

    t.equal(actual, expected, should);
  }

  {
    const should = 'Should return most viewed jobs';
    const actual = R.compose(Array.isArray, R.prop('jobs'))(result);
    const expected = true;

    t.equal(actual, expected, should);
  }

  {
    const should = 'Every item in response should contain three items (path, title, views)';
    const actual = getTypes(result.top[0]);
    const expected = ['String', 'String', 'Number'];

    t.deepEqual(actual, expected, should);
  }
});

test('API: google.getViewMetrics', async (t) => {
  const result = await getViewMetrics(new Date());

  {
    const should = 'Should return view stats for four periods (current week/year, previous week/year)';
    const actual = R.length(result);
    const expected = 4;

    t.equal(actual, expected, should);
  }

  {
    const should = 'Should return stats for users, sessions and pageviews in each period';
    const actual = R.map(R.allPass([R.has('users'), R.has('sessions'), R.has('pageviews')]), result);
    const expected = [true, true, true, true];

    t.deepEqual(actual, expected, should);
  }

  {
    const should = 'Should return stats as numbers';
    const actual = R.map(
      R.allPass([R.propIs(Number, 'users'), R.propIs(Number, 'sessions'), R.propIs(Number, 'pageviews')]),
      result,
    );
    const expected = [true, true, true, true];

    t.deepEqual(actual, expected, should);
  }
});

test('API: google.getReferrals', async (t) => {
  const result = await getReferrals(new Date());

  {
    const should = 'Should return top five referrals';
    const actual = R.length(result);
    const expected = 5;

    t.equal(actual, expected, should);
  }

  {
    const should = 'Should return a list of pairs (title, referrals)';
    const actual = [
      R.is(Number, R.prop(1, R.prop(0, result))),
      R.is(String, R.prop(0, R.prop(0, result))),
    ];
    const expected = [true, true];

    t.deepEqual(actual, expected, should);
  }
});
