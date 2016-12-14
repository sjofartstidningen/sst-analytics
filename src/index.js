// @flow
/**
 * Data to get:
 * Sessions       week  year
 * Uniq sessions  week  year
 * Article views  week  year
 *
 * Most read      week
 *
 * Referrals      week
 */
import subDays from 'date-fns/sub_days';
import startOfWeek from 'date-fns/start_of_iso_week';
import endOfWeek from 'date-fns/end_of_iso_week';
import subWeeks from 'date-fns/sub_weeks';
import startOfYear from 'date-fns/start_of_year';
import subYears from 'date-fns/sub_years';
import format from 'date-fns/format';
import R from 'ramda';
import googleApi from './api/google';

const oneWeekAgo: Date = subDays(Date.now(), 7);
const start: Date = startOfWeek(oneWeekAgo);
const end: Date = endOfWeek(oneWeekAgo);

const startPrevWeek = subWeeks(start, 1);
const endPrevWeek = subWeeks(end, 1);

const startYear = startOfYear(end);
const endYear = end;
const startPrevYear = subYears(startYear, 1);
const endPrevYear = subYears(endYear, 1);

const getViews = R.composeP(R.prop('totalsForAllResults'), googleApi);

const cond = R.cond([[R.isNil, R.always(null)], [R.T, R.trim]]);
const nameLens = R.lensIndex(1);
const rename = R.compose(cond, R.view(nameLens), R.split('|'));
const over = R.over(nameLens, rename);
const filter = R.compose(R.not, R.isNil, R.view(nameLens));
const getMostViews = R.composeP(
  R.take(5),
  R.filter(filter),
  R.map(over),
  R.tail,
  R.prop('rows'),
  googleApi,
);

const getReferrals = R.composeP(R.take(5), R.prop('rows'), googleApi);

const run = async () => {
  const viewMetrics = 'ga:sessions,ga:pageviews,ga:users';

  const currentWeek = await getViews({ start, end, metrics: viewMetrics });
  const previousWeek = await getViews({ start: startPrevWeek, end: endPrevWeek, metrics: viewMetrics });

  const currentYear = await getViews({ start: startYear, end: endYear, metrics: viewMetrics });
  const previousYear = await getViews({ start: startPrevYear, end: endPrevYear, metrics: viewMetrics });

  const mostViews = await getMostViews({
    start,
    end,
    metrics: 'ga:pageviews',
    dimensions: 'ga:pagePath,ga:pageTitle',
    sort: '-ga:pageviews',
  });

  const referrals = await getReferrals({
    start,
    end,
    metrics: 'ga:sessions',
    dimensions: 'ga:source',
    sort: '-ga:sessions',
  });
};

run();
