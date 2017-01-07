const endOfWeek = require('date-fns/end_of_week');
const subDays = require('date-fns/sub_days');
const getReport = require('./report');
const getHtml = require('./template');
const send = require('./send-campaign');

const today = new Date();
const endOfLastWeek = endOfWeek(subDays(today, 7));

module.exports = async () => {
  try {
    const report = await getReport(endOfLastWeek);
    const html = await getHtml(report);
    const res = await send(report, html);

    return res;
  } catch (err) {
    throw err;
  }
};
