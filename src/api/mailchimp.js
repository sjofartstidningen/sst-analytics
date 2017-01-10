// @flow
const axios = require('axios');
const config = require('../config');

const MC_KEY = config('MC_KEY');
const MC_USER = config('MC_USER');

module.exports = axios.create({
  baseURL: 'https://us5.api.mailchimp.com/3.0/',
  auth: {
    username: MC_USER,
    password: MC_KEY,
  },
});
