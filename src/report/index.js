const getISOWeek = require('date-fns/get_iso_week');
const getYear = require('date-fns/get_year');
const googleReport = require('./google/report');
const mailchimpReport = require('./mailchimp/report');


module.exports = async (date) => {
  try {
    const report = {
      meta: {
        title: 'Statistik för webb och nyhetsbrev',
        logotype_url: 'https://gallery.mailchimp.com/1369dbd8781eb3a85956a7247/images/1deadd3b-f804-445e-8498-4bdaf24f03d4.png',
        week: getISOWeek(date),
        year: getYear(date),
      },
      google: await googleReport(date),
      mailchimp: await mailchimpReport(date),
    };

    return report;
  } catch (err) {
    throw err;
  }
};
