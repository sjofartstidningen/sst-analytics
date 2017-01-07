// @flow
const axios = require('axios');
const config = require('../../config');
const generateUrl = require('./generateUrl');

const MC_KEY = config('MC_KEY');
const MC_USER = config('MC_USER');

module.exports = axios.create({
  baseURL: generateUrl(),
  auth: {
    username: MC_USER,
    password: MC_KEY,
  },
});
