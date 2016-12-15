import format from 'date-fns/format';
import R from 'ramda';

export const formatDate = (date: Date): string => format(date, 'YYYY-MM-DD');
export const capitalizeFirst = (str: string): string => R.compose(
  R.join(''),
  R.over(R.lensIndex(0), R.toUpper),
  R.split(''),
)(str);
