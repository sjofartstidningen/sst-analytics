const axios = require('axios');
const auth = require('./auth');

const rootUrl = 'https://analyticsreporting.googleapis.com/v4/reports:batchGet';

module.exports = async (reportRequests) => {
  const token = await auth();

  const { data } = await axios({
    method: 'post',
    url: rootUrl,
    data: { reportRequests },
    headers: { Authorization: `${token.token_type} ${token.access_token}` },
  });

  return data;
};
