import getISOWeek from 'date-fns/get_iso_week';
import getYear from 'date-fns/get_year';
import googleReport from './google/report';
import mailchimpReport from './mailchimp/report';


export default async date => ({
  meta: {
    title: 'Statistik för webb och nyhetsbrev',
    logotype_url: 'https://gallery.mailchimp.com/1369dbd8781eb3a85956a7247/images/1deadd3b-f804-445e-8498-4bdaf24f03d4.png',
    week: getISOWeek(date),
    year: getYear(date),
  },
  google: await googleReport(),
  mailchimp: await mailchimpReport(),
});