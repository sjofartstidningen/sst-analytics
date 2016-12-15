import R from 'ramda';

// buildGaString :: [String] => String
export default (metricsArr: Array<GAmetrics>) => (
  R.compose(R.join(','), R.map(R.concat('ga:')))(metricsArr)
);
