const mailchimp = require('../../src/api/mailchimp');

module.exports = id => mailchimp.delete(`/campaigns/${id}`);
