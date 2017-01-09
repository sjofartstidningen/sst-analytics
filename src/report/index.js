const R = require('ramda');
const getISOWeek = require('date-fns/get_iso_week');
const getYear = require('date-fns/get_year');
const subWeeks = require('date-fns/sub_weeks');
const google = require('./google');
const mailchimp = require('./mailchimp');

const applyData = R.curry((key, promise, obj) => promise.then(res => R.assoc(key, res, obj)));

const buildMeta = today => Promise.resolve({
  title: 'Statistik för webb och nyhetsbrev',
  logotype_url: 'https://gallery.mailchimp.com/1369dbd8781eb3a85956a7247/images/1deadd3b-f804-445e-8498-4bdaf24f03d4.png',
  week: getISOWeek(subWeeks(today, 1)),
  year: getYear(subWeeks(today, 1)),
});

module.exports = today => R.composeP(
  applyData('mailchimp', mailchimp(today)),
  applyData('google', google(today)),
  applyData('meta', buildMeta(today)),
)({});
