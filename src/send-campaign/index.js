const R = require('ramda');
const mailchimp = require('../api/mailchimp');
const config = require('../config');
const { identityP } = require('../utils');

const propId = R.prop('id');

const subjectLine = R.compose(
  r => `${r.meta.title} – vecka ${r.meta.week} - ${r.meta.year}`,
  R.head,
);

const title = R.compose(
  r => `Statistik vecka ${r.meta.week} - ${r.meta.year}`,
  R.head,
);


const createCampaign = R.composeP(
  R.prop('data'),
  data => mailchimp.post('/campaigns', data),
  R.applySpec({
    recipients: { list_id: R.always(config('MC_LIST_ID')) },
    type: R.always('regular'),
    settings: {
      title,
      subject_line: subjectLine,
      folder_id: R.always(config('MC_FOLDER_ID')),
      from_name: R.always('Sjöfartstidningen'),
      reply_to: R.always('info@sjofartstidningen.se'),
      to_name: R.always('*|FNAME|*'),
      auto_footer: R.T,
    },
  }),
  identityP,
);

const addContent = R.curry((html, data) => mailchimp.put(
  `/campaigns/${propId(data)}/content`,
  { html },
).then(R.always(data)));

const send = (data) => {
  const NODE_ENV = config('NODE_ENV');

  if (NODE_ENV !== 'production') return data;
  return mailchimp.post(`/campaigns/${propId(data)}/actions/send`).then(R.always(data));
};

const constructSuccessMessage = R.applySpec({
  id: propId,
  status: R.always('ok'),
  subject: R.compose(R.prop('subject_line'), R.prop('settings')),
});

module.exports = (...args) => R.composeP(
  constructSuccessMessage,
  send,
  addContent(R.last(args)),
  createCampaign,
)(args);
