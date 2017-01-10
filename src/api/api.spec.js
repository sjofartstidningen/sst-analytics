const test = require('blue-tape');
const R = require('ramda');
const mailchimp = require('./mailchimp');
const auth = require('./auth');
const google = require('./google');

test('API: mailchimp()', t => mailchimp.get('/campaigns')
  .then((res) => {
    const should = 'Should return a response from Mailchimp API';
    const actual = Array.isArray(res.data.campaigns);
    const expected = true;

    t.equal(actual, expected, should);
  }));


test('API: auth()', t => auth.then((token) => {
  const should = 'Should return a token to authenticate with';
  const actual = [R.type(token), R.type(token.access_token)];
  const expected = ['Object', 'String'];

  t.deepEqual(actual, expected, should);
}));


test('API: google()', (t) => {
  const mockReportRequests = [
    {
      viewId: '7009314',
      dateRanges: [{ startDate: '2016-11-01', endDate: '2016-11-30' }],
      metrics: [{ expression: 'ga:users' }],
    },
  ];

  return google.post('/', { reportRequests: mockReportRequests })
    .then((res) => {
      const should = 'Should return a response from Google Analytics';
      const actual = Array.isArray(res.data.reports);
      const expected = true;

      t.equal(actual, expected, should);
    });
});
