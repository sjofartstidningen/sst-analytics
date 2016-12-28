import R from 'ramda';
import coreApi from '../mailchimp';

const constructFields = R.compose(R.join(','), R.map(R.concat('urls_clicked.')));

const urlLens = R.lensProp('url');
const prettyUrl = R.over(
  urlLens,
  R.compose(R.nth(0), R.match(/http:\/\/www.sjofartstidningen.se\/(\S+\/|\?p=\d+)/)),
);

const combineEqual = R.reduce((acc, obj) => {
  const objUrl = R.prop('url', obj);
  const index = R.findIndex(R.propEq('url', objUrl), acc);

  if (index === -1) return [...acc, obj];

  const indexLens = R.lensIndex(index);
  const totalClicksLens = R.lensProp('total_clicks');

  const objTotalClicks = R.prop('total_clicks', obj);

  const addTotalClicks = R.over(totalClicksLens, R.add(objTotalClicks));
  return R.over(indexLens, addTotalClicks, acc);
}, []);

const extractData = R.compose(
  R.take(5),
  R.reverse,
  R.sortBy(R.prop('total_clicks')),
  combineEqual,
  R.map(prettyUrl),
  R.prop('urls_clicked'),
  R.prop('data'),
);

export default async (campaignId: string) => {
  const result = await coreApi.get(`/reports/${campaignId}/click-details`, {
    params: {
      fields: constructFields(['url', 'total_clicks']),
    },
  });

  // console.log(result.data.urls_clicked);

  return extractData(result);
};
