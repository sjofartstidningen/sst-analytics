const test = require('blue-tape');
const R = require('ramda');
const getMailchimpReport = require('../mailchimp');
const clickReport = require('./clickReport');

const propType = R.compose(R.type, R.prop);

test('REPORT: getMailchimpReport()', (t) => {
  const date = new Date(2016, 11, 1);
  return getMailchimpReport(date)
    .then((report) => {
      const singleReport = R.head(report);

      {
        const should = 'Should return an array of two latest reports';
        const actual = R.length(report) <= 2;
        const expected = true;

        t.equal(actual, expected, should);
      }

      {
        const should = 'Should return reports containing props campaign_title, emails_sent, opens, clicks';
        const actual = [
          propType('campaign_title', singleReport),
          propType('emails_sent', singleReport),
          propType('opens', singleReport),
          propType('clicks', singleReport),
        ];
        const expected = ['String', 'Number', 'Object', 'Object'];

        t.deepEqual(actual, expected, should);
      }

      {
        const should = 'Should return reports containing list of most clicked links';
        const actual = R.length(R.prop('links', singleReport)) <= 5;
        const expected = true;

        t.equal(actual, expected, should);
      }
    });
});

test('REPORT: mailchimp.clickReport()', (t) => {
  const id = 'bddd6b0f84';
  return clickReport(id)
    .then((res) => {
      const item = R.head(res);

      {
        const should = 'Should return an array of five most clicked links';
        const actual = R.length(res) <= 5;
        const expected = true;

        t.equal(actual, expected, should);
      }

      {
        const should = 'Should return items containing url and total_clicks';
        const actual = [propType('url', item), propType('total_clicks', item)];
        const expected = ['String', 'Number'];

        t.deepEqual(actual, expected, should);
      }
    });
});
