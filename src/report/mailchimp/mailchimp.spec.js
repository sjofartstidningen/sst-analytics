import test from 'blue-tape';
import R from 'ramda';
import report from './report';
import clickReport from './clickReport';

const propIsNumber = R.propIs(Number);
const propIsString = R.propIs(String);
const propIsObject = R.propIs(Object);

test('API: mailchimp.report', async (t) => {
  const result = await report(new Date(2014, 10, 10));
  const singleReport = R.head(result);

  {
    const should = 'Should return an array of two latest reports';
    const actual = R.length(result) <= 2;
    const expected = true;

    t.equal(actual, expected, should);
  }

  {
    const should = 'Should return reports containing props campaign_title, emails_sent, opens, clicks';
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
    const actual = R.compose(R.length, R.prop('links'))(singleReport) <= 5;
    const expected = true;

    t.equal(actual, expected, should);
  }
});

test('API: mailchimp.clickReport', async (t) => {
  const result = await clickReport('bddd6b0f84');
  const item = R.head(result);

  {
    const should = 'Should return an array of five most clicked links';
    const actual = R.length(result) <= 5;
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
