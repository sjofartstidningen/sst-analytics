const R = require('ramda');
const viewMetrics = require('./viewMetrics');
const referrals = require('./referrals');
const mostViews = require('./mostViews');

// eslint-disable-next-line
const applyPromiseRes = R.curry((key, promise, obj) => promise.then(R.assoc(key, R.__, obj)));

module.exports = date => R.composeP(
  applyPromiseRes('mostViews', mostViews(date)),
  applyPromiseRes('referrals', referrals(date)),
  applyPromiseRes('viewMetrics', viewMetrics(date)),
)({});
