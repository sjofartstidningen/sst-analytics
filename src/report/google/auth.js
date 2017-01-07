const jwt = require('jsonwebtoken');
const axios = require('axios');
const Qs = require('qs');
const config = require('../../config');

const GA_PRIVATE_KEY = config('GA_PRIVATE_KEY');
const GA_CLIENT_EMAIL = config('GA_CLIENT_EMAIL');

const googleTokenUri = 'https://www.googleapis.com/oauth2/v4/token';
const googleGrantType = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
const googleDefaultScope = 'https://www.googleapis.com/auth/analytics.readonly';

let auth = null;

module.exports = async (scope = googleDefaultScope) => {
  if (auth != null) return auth;

  const assertion = jwt.sign({
    iss: GA_CLIENT_EMAIL,
    aud: googleTokenUri,
    scope,
  }, GA_PRIVATE_KEY, {
    expiresIn: '1h',
    header: { alg: 'RS256', typ: 'JWT' },
  });

  const data = Qs.stringify({
    grant_type: googleGrantType,
    assertion,
  });

  const { data: token } = await axios.post(googleTokenUri, data);

  auth = token;
  return token;
};
