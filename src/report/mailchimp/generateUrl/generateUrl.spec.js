const test = require('blue-tape');
const generateUrl = require('../generateUrl');

test('API: mailchimp.generateUrl.baseUrl', (t) => {
  const should = 'Should return baseUrl for Mailchimp API';
  const actual = generateUrl();
  const expected = 'https://us5.api.mailchimp.com/3.0/';

  t.equal(actual, expected, should);
  t.end();
});
