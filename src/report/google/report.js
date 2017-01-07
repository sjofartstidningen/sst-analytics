const getViewMetrics = require('./getViewMetrics');
const getReferrals = require('./getReferrals');
const getMostViews = require('./getMostViews');

module.exports = async () => {
  try {
    const data = {
      viewMetrics: {
        week: await getViewMetrics('WEEK'),
        year: await getViewMetrics('YEAR'),
      },
      referrals: await getReferrals('WEEK'),
      mostViews: await getMostViews('WEEK'),
    };

    return data;
  } catch (err) {
    throw err;
  }
};
