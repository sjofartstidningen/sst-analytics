const axios = require('axios');
const auth = require('./auth');

const baseUrl = 'https://analyticsreporting.googleapis.com/v4/reports:batchGet';
const google = axios.create({ baseUrl });

google.interceptors.request.use(config => auth.then(token => Object.assign({}, config, {
  headers: { Authorization: `${token.token_type} ${token.access_token}` },
})));

module.exports = google;
