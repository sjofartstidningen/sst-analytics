const startOfWeek = require('date-fns/start_of_iso_week');
const endOfWeek = require('date-fns/end_of_iso_week');
const subWeeks = require('date-fns/sub_weeks');
const subYears = require('date-fns/sub_years');
const format = require('date-fns/format');

type Range = { endDate: Date, startDate: Date };
type DateRanges = Array<Range>;

module.exports = (today: Date): DateRanges => {
  const currentWeekEnd = endOfWeek(subWeeks(today, 1));
  const currentWeekStart = startOfWeek(currentWeekEnd);
  const previousWeekEnd = endOfWeek(subWeeks(currentWeekEnd, 1));
  const previousWeekStart = startOfWeek(subWeeks(currentWeekEnd, 1));
  const currentYearEnd = currentWeekEnd;
  const currentYearStart = subYears(currentYearEnd, 1);
  const previousYearEnd = currentYearStart;
  const previousYearStart = subYears(previousYearEnd, 1);

  return [
    { endDate: format(currentWeekEnd, 'YYYY-MM-DD'), startDate: format(currentWeekStart, 'YYYY-MM-DD') },
    { endDate: format(previousWeekEnd, 'YYYY-MM-DD'), startDate: format(previousWeekStart, 'YYYY-MM-DD') },
    { endDate: format(currentYearEnd, 'YYYY-MM-DD'), startDate: format(currentYearStart, 'YYYY-MM-DD') },
    { endDate: format(previousYearEnd, 'YYYY-MM-DD'), startDate: format(previousYearStart, 'YYYY-MM-DD') },
  ];
};
