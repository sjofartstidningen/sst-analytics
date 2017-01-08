// @flow
const url = require('url');
const R = require('ramda');
const axios = require('axios');
const config = require('../config');

const MC_KEY = config('MC_KEY');
const MC_USER = config('MC_USER');

const generateUrl = R.compose(
  url.format,
  R.applySpec({
    protocol: R.always('https:'),
    pathname: R.always('/3.0/'),
    host: R.identity,
  }),
  R.concat(R.__, '.api.mailchimp.com'), // eslint-disable-line no-underscore-dangle
  R.nth(1),
  R.match(/-(\S+)$/),
);

module.exports = axios.create({
  baseURL: generateUrl(MC_KEY),
  auth: {
    username: MC_USER,
    password: MC_KEY,
  },
});
