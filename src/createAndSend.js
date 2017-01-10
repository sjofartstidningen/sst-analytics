const getReport = require('./report');
const getHtml = require('./template');
const send = require('./send-campaign');

module.exports = async (today) => {
  const report = await getReport(today);
  const html = await getHtml(report);
  return send(report, html);
};
