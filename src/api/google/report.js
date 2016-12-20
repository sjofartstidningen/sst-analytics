import getViewMetrics from './getViewMetrics';
import getReferrals from './getReferrals';
import getMostViews from './getMostViews';

export default async () => {
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
