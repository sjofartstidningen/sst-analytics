// @flow
const GA_ACCOUNT_ID = Number(process.env.GA_ACCOUNT_ID);
const GA_PROFILE_ID = Number(process.env.GA_PROFILE_ID);
const GA_WEB_PROPERTY = process.env.GA_WEB_PROPERTY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (
  !GA_ACCOUNT_ID || GA_ACCOUNT_ID == null ||
  !GA_PROFILE_ID || GA_PROFILE_ID == null ||
  !GA_WEB_PROPERTY || GA_WEB_PROPERTY == null ||
  !CLIENT_EMAIL || CLIENT_EMAIL == null ||
  !PRIVATE_KEY || PRIVATE_KEY == null
) {
  throw new Error('Necessary environment variables is not defined.\nCheck "./env-cmd-example" for a list of necessary variables');
}

if (
  isNaN(Number(GA_ACCOUNT_ID)) ||
  isNaN(Number(GA_PROFILE_ID))
) {
  throw new Error('Environment variables GA_ACCOUNT_ID and GA_PROFILE_ID must be numbers.');
}

exports.GA_ACCOUNT_ID = GA_ACCOUNT_ID;
exports.GA_PROFILE_ID = GA_PROFILE_ID;
exports.GA_WEB_PROPERTY = GA_WEB_PROPERTY;
exports.CLIENT_EMAIL = CLIENT_EMAIL;
exports.PRIVATE_KEY = PRIVATE_KEY;
