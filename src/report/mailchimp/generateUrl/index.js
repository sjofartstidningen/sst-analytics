// @flow

const url = require('url');
const R = require('ramda');
const config = require('../../../config');

const MC_KEY = config('MC_KEY');

const urlSpec = {
  protocol: 'https:',
  pathname: '/3.0/',
};
const location = R.nth(1, R.match(/-(\S+)$/, MC_KEY));

// baseUrl () -> String
module.exports = (): string => R.compose(
  url.format,
  R.assoc('host', R.concat(location, '.api.mailchimp.com')),
)(urlSpec);
