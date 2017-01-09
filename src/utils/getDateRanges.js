const startOfWeek = require('date-fns/start_of_iso_week');
const endOfWeek = require('date-fns/end_of_iso_week');
const subWeeks = require('date-fns/sub_weeks');
const subYears = require('date-fns/sub_years');
const formatDate = require('../utils').formatDate;

type Range = { endDate: Date, startDate: Date };
type DateRanges = Array<Range>;

module.exports = (today: Date = new Date()): DateRanges => {
  const currentWeekEnd = endOfWeek(subWeeks(today, 1));
  const currentWeekStart = startOfWeek(currentWeekEnd);
  const previousWeekEnd = endOfWeek(subWeeks(currentWeekEnd, 1));
  const previousWeekStart = startOfWeek(subWeeks(currentWeekEnd, 1));
  const currentYearEnd = currentWeekEnd;
  const currentYearStart = subYears(currentYearEnd, 1);
  const previousYearEnd = currentYearStart;
  const previousYearStart = subYears(previousYearEnd, 1);

  return [
    { endDate: formatDate(currentWeekEnd), startDate: formatDate(currentWeekStart) },
    { endDate: formatDate(previousWeekEnd), startDate: formatDate(previousWeekStart) },
    { endDate: formatDate(currentYearEnd), startDate: formatDate(currentYearStart) },
    { endDate: formatDate(previousYearEnd), startDate: formatDate(previousYearStart) },
  ];
};
