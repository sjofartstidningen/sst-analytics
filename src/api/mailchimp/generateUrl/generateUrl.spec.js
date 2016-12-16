import test from 'blue-tape';
import * as generateUrl from '../generateUrl';

test('API: mailchimp.generateUrl.baseUrl', (t) => {
  const should = 'Should return baseUrl for Mailchimp API';
  const actual = generateUrl.baseUrl();
  const expected = 'https://us5.api.mailchimp.com/3.0/';

  t.equal(actual, expected, should);
  t.end();
});

test('API: mailchimp.generateUrl.subReports', (t) => {
  const should = 'Should generate a url for sub-reports on Mailchimp API';
  const actual = generateUrl.subReports(123123); // <- Campaign ID
  const expected = 'https://us5.api.mailchimp.com/3.0/reports/123123/sub-reports';

  t.equal(actual, expected, should);
  t.end();
});
