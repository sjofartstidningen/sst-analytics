const axios = require('axios');
const auth = require('./auth');

const baseUrl = 'https://analyticsreporting.googleapis.com/v4/reports:batchGet';

const google = axios.create();
google.interceptors.request.use(config => auth.then((token) => {
  const newConfig = Object.assign({}, config, {
    headers: Object.assign({}, config.headers, { Authorization: `${token.token_type} ${token.access_token}` }),
    url: baseUrl,
  });

  return newConfig;
}));

module.exports = google;
