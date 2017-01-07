import getViewMetrics from './getViewMetrics';
import getReferrals from './getReferrals';
import getMostViews from './getMostViews';
import { log, error } from '../../config';

export default async () => {
  log('Building Google report');
  try {
    const data = {
      viewMetrics: {
        week: await getViewMetrics('WEEK'),
        year: await getViewMetrics('YEAR'),
      },
      referrals: await getReferrals('WEEK'),
      mostViews: await getMostViews('WEEK'),
    };

    log('Successfully built Google report');
    return data;
  } catch (err) {
    error('Error building Google report: %O', err);
    throw err;
  }
};
