const R = require('ramda');
const mailchimp = require('../../api/mailchimp');
const { constructFields, identityP } = require('../../utils');
const combineEqual = require('../../utils/combineEqual');

const urlsClickedFields = constructFields('urls_clicked.');

const urlLens = R.lensProp('url');
const prettify = R.compose(R.nth(0), R.match(/http:\/\/www.sjofartstidningen.se\/(\S+\/|\?p=\d+)/));
const prettyUrl = R.over(urlLens, prettify);

const equalityCheck = R.curry((currItem, prevItem) => {
  const url = R.prop('url');
  const currUrl = url(currItem);
  const prevUrl = url(prevItem);

  return R.equals(currUrl, prevUrl);
});

const combineFn = R.mergeWithKey((k, l, r) => (k === 'total_clicks' ? R.add(l, r) : r));

const extractData = R.compose(
  R.take(5),
  R.reverse,
  R.sortBy(R.prop('total_clicks')),
  combineEqual(equalityCheck, combineFn),
  R.map(prettyUrl),
  R.prop('urls_clicked'),
  R.prop('data'),
);

const body = { params: { fields: urlsClickedFields(['url', 'total_clicks']) } };
const mailchimpGet = R.curry((data, path) => mailchimp.get(path, data));

module.exports = R.composeP(
  extractData,
  mailchimpGet(body),
  id => `/reports/${id}/click-details`,
  identityP,
);
