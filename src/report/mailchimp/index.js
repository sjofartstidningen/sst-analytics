const R = require('ramda');
const Promise = require('bluebird');
const mailchimp = require('../../api/mailchimp');
const clickReport = require('./clickReport');
const getDateRanges = require('../../utils/getDateRanges');
const { identityP, constructFields } = require('../../utils');

const reportFields = constructFields('reports.');

const buildRequestData = R.applySpec({
  params: {
    before_send_time: R.compose(R.prop('endDate'), R.head),
    since_send_time: R.compose(R.prop('startDate'), R.head),
    fields: R.always(reportFields(['id', 'campaign_title', 'subject_line', 'emails_sent', 'opens', 'clicks'])),
  },
});

const isNotAnalyticsMail = R.complement(R.compose(R.test(/statistik/), R.prop('campaign_title')));
const filterMails = R.filter(isNotAnalyticsMail);

const extractData = R.compose(
  filterMails,
  R.prop('reports'),
  R.prop('data'),
);

const applyClickReport = (report) => {
  const id = R.prop('id', report);
  return clickReport(id)
    .then(R.assoc('links', R.__, report)); // eslint-disable-line no-underscore-dangle
};

// getMailchimpReport :: date -> Promise
module.exports = R.composeP(
  Promise.all,
  R.map(applyClickReport),
  extractData,
  requestData => mailchimp.get('/reports', requestData),
  buildRequestData,
  getDateRanges,
  identityP,
);
