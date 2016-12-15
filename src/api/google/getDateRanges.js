import startOfWeek from 'date-fns/start_of_iso_week';
import endOfWeek from 'date-fns/end_of_iso_week';
import subWeeks from 'date-fns/sub_weeks';
import subYears from 'date-fns/sub_years';

type Range = { end: Date, start: Date };
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
    { end: currentWeekEnd, start: currentWeekStart },
    { end: previousWeekEnd, start: previousWeekStart },
    { end: currentYearEnd, start: currentYearStart },
    { end: previousYearEnd, start: previousYearStart },
  ];
};
