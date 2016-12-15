import R from 'ramda';
import coreApi from '../google';
import buildGaString from './buildGaString';
import getDateRanges from './getDateRanges';
import { capitalizeFirst } from '../../utils';

const regexp = /(?:\S+\.)*(\S+)(?:\.\S*)/; // matches eg. m.facebook.com || facebook.com -> facebook

// renameOnMatch :: String -> String
const renameOnMatch = R.cond([
  [R.test(regexp), R.compose(R.nth(1), R.match(regexp))],
  [R.test(/^\((\S+)\)$/), R.compose(R.nth(1), R.match(/^\((\S+)\)$/))],
  [R.T, R.identity],
]);

// renameReferrer :: [key, value] -> [key, value]
const renameReferrer = R.over(R.lensIndex(0), R.compose(capitalizeFirst, renameOnMatch));

// numberToNumber :: [key, value] -> [key, value]
const numberToNumber = R.over(R.lensIndex(1), Number);

// mergeSimilarReferrals :: [[k, a], [k, b] ...] -> [[k, b], [k, a] ...]
const mergeSimilarReferrals = R.compose(
  R.reverse,
  R.sortBy(R.prop(1)),
  R.toPairs,
  R.reduce(R.mergeWith(R.add), {}),
  R.reduce((acc, arr) => R.append({ [arr[0]]: arr[1] }, acc), []),
);

// callAndExtractReferrals :: Payload => Promise [k, v]
const callAndExtractReferrals = R.composeP(
  R.take(5),
  mergeSimilarReferrals,
  R.map(R.compose(numberToNumber, renameReferrer)),
  R.prop('rows'),
  coreApi,
);

// getReferrals :: Date => Promise [k, v]
export default async (today: Date): Promise<Array<Array<string | number>>> => {
  const payload = R.compose(
    R.assoc('sort', '-ga:pageviews'),
    R.assoc('dimensions', buildGaString(['source'])),
    R.assoc('metrics', buildGaString(['pageviews'])),
    R.head,
    getDateRanges,
  )(today);

  try {
    const result = await callAndExtractReferrals(payload);
    return result;
  } catch (err) {
    throw err;
  }
};
