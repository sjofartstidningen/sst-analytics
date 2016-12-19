import test from 'blue-tape';
import R from 'ramda';
import report from './report';
import clickReport from './clickReport';

const propIsNumber = R.propIs(Number);
const propIsString = R.propIs(String);
const propIsObject = R.propIs(Object);

test('API: mailchimp.report', async (t) => {
  const result = await report();
  const singleReport = R.head(result);

  {
    const should = 'Should return an array of reports';
    const actual = Array.isArray(result);
    const expected = true;

    t.equal(actual, expected, should);
  }

  {
    const should = 'Should return reports containing containing props campaign_title, emails_sent, opens, clicks';
    const actual = [
      propIsString('campaign_title', singleReport),
      propIsNumber('emails_sent', singleReport),
      propIsObject('opens', singleReport),
      propIsObject('clicks', singleReport)];
    const expected = [true, true, true, true];

    t.deepEqual(actual, expected, should);
  }

  {
    const should = 'Should return reports containing list of most clicked links';
    const actual = R.compose(Array.isArray, R.prop('links'))(singleReport);
    const expected = true;

    t.equal(actual, expected, should);
  }
});

test('API: mailchimp.clickReport', async (t) => {
  const result = await clickReport('00b7ec190a');
  const item = R.head(result);

  {
    const should = 'Should return an array of most clicked links';
    const actual = Array.isArray(result);
    const expected = true;

    t.equal(actual, expected, should);
  }

  {
    const should = 'Should return items containing url and total_clicks';
    const actual = [propIsString('url', item), propIsNumber('total_clicks', item)];
    const expected = [true, true];

    t.deepEqual(actual, expected, should);
  }
});
