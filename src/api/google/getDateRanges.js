import startOfWeek from 'date-fns/start_of_iso_week';
import endOfWeek from 'date-fns/end_of_iso_week';
import subWeeks from 'date-fns/sub_weeks';
import subYears from 'date-fns/sub_years';
import format from 'date-fns/format';

type Range = { endDate: Date, startDate: Date };
type DateRanges = Array<Range>;

export default (today: Date): DateRanges => {
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
