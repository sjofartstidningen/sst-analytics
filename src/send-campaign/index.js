const axios = require('axios');
const R = require('ramda');
const url = require('url');
const config = require('../config');

const MC_KEY = config('MC_KEY');
const MC_USER = config('MC_USER');
const MC_LIST_ID = config('MC_LIST_ID');
const MC_FOLDER_ID = config('MC_FOLDER_ID');

const urlSpec = {
  protocol: 'https:',
  pathname: '/3.0/',
};

const location = R.nth(1, R.match(/-(\S+)$/, MC_KEY));

const baseUrl = () => R.compose(
  url.format,
  R.assoc('host', R.concat(location, '.api.mailchimp.com')),
)(urlSpec);

const mailchimp = axios.create({
  baseURL: baseUrl(),
  auth: {
    username: MC_USER,
    password: MC_KEY,
  },
});

module.exports = async (report, html) => {
  try {
    const { data: { id } } = await mailchimp.post('/campaigns', {
      recipients: { list_id: MC_LIST_ID },
      settings: {
        subject_line: `${report.meta.title} – vecka ${report.meta.week}/${report.meta.year}`,
        title: `Statistik vecka ${report.meta.week}/${report.meta.year}`,
        from_name: 'Sjöfartstidningen',
        reply_to: 'info@sjofartstidningen.se',
        to_name: '*|FNAME|*',
        folder_id: MC_FOLDER_ID,
        auto_footer: true,
      },
      type: 'regular',
    });

    await mailchimp.put(`/campaigns/${id}/content`, { html });

    const res = await mailchimp.get(`/campaigns/${id}/send-checklist`);
    if (!res.data.is_ready) throw new Error('An error occured', res.data);

    await mailchimp.post(`/campaigns/${id}/actions/send`);

    return 'MESSAGE SENT SUCCESSFULLY';
  } catch (err) {
    throw err;
  }
};
