import test from 'blue-tape';
import config from './config';

test('Module: config()', (t) => {
  {
    const should = 'Should return config variables';
    const actual = config('MC_LIST_ID');
    const expected = '15a43ccea6';

    t.equal(actual, expected, should);
  }

  {
    process.env.NODE_ENV = 'production';
    const should = 'Should return config variables';
    const actual = config('MC_LIST_ID');
    const expected = 'abdd15164f';

    t.equal(actual, expected, should);
    process.env.NODE_ENV = 'development';
  }

  {
    const should = 'Should return secret values as well';
    const actual = config('MC_KEY', 'IT WILL NOT BE THIS') !== 'IT WILL NOT BE THIS';
    const expected = true;

    t.equal(actual, expected, should);
  }

  {
    const should = 'Should return default value if no variable is found';
    const actual = config('RANDOM_CONFIG', 12345);
    const expected = 12345;

    t.equal(actual, expected, should);
  }

  t.end();
});
