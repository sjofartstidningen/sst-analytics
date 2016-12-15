import R from 'ramda';
import coreApi from '../google';
import getDateRanges from './getDateRanges';
import buildGaString from './buildGaString';

// generalPattern :: String => Boolean
const generalPattern = R.complement(R.anyPass([
  R.test(/^\/$/),
  R.test(/^\/nyheter\/$/),
  R.test(/^\/jobb\//),
  R.test(/^\/jobb-karriar\/folk-pa-vag\/$/),
  R.test(/^\/bloggar\/$/),
]));

// jobPattern :: String => Boolean
const jobPattern = R.anyPass([R.test(/^\/jobb\//)]);

// renamer :: String => String
const renamer = R.over(R.lensIndex(1), R.compose(R.trim, R.replace(/\|/g, ''), R.replace(/Sjöfartstidningen/g, '')));
const viewToNumber = R.over(R.lensIndex(2), Number);
const takeAndTransformItems = R.compose(R.map(R.compose(viewToNumber, renamer)), R.take(5));

const spec = {
  top: R.compose(takeAndTransformItems, R.filter(R.compose(generalPattern, R.head))),
  jobs: R.compose(takeAndTransformItems, R.filter(R.compose(jobPattern, R.head))),
};

// callAndExtractMostViews :: Payload => Promise {k: v}
const callAndExtractMostViews = R.composeP(R.applySpec(spec), R.prop('rows'), coreApi);

// getMostViews :: Date => Promise {k: v}
export default async (today: Date): Promise<any> => {
  const payload = R.compose(
    R.assoc('sort', '-ga:pageviews'),
    R.assoc('dimensions', buildGaString(['pagePath', 'pageTitle'])),
    R.assoc('metrics', buildGaString(['pageviews'])),
    R.head,
    getDateRanges,
  )(today);

  try {
    const result = await callAndExtractMostViews(payload);
    return result;
  } catch (err) {
    throw err;
  }
};
