import R from 'ramda';
import Promise from 'bluebird';
import coreApi from '../mailchimp';
import clickReport from './clickReport';
import getDateRanges from '../google/getDateRanges';

const identityP = R.bind(Promise.resolve, Promise);
const constructFields = R.compose(R.join(','), R.map(R.concat('reports.')));

const isNotAnalyticsMail = R.complement(R.compose(R.test(/statistik/), R.prop('campaign_title')));
const filterMails = R.filter(isNotAnalyticsMail);

const applyClickReport = async (report) => {
  const { id } = report;
  const currentClickReport = await clickReport(id);
  return R.assoc('links', currentClickReport, report);
};

const extractData = R.composeP(
  Promise.all,
  R.map(applyClickReport),
  filterMails,
  R.prop('reports'),
  R.prop('data'),
  identityP,
);

export default async (date) => {
  const [{ startDate, endDate }] = getDateRanges(date);
  const fields = constructFields(['id', 'campaign_title', 'subject_line', 'emails_sent', 'opens', 'clicks']);

  const response = await coreApi.get('/reports', {
    params: {
      before_send_time: endDate,
      since_send_time: startDate,
      fields,
    },
  });

  return extractData(response);
};
