const R = require('ramda');

// combineEqual :: (a -> a -> Boolean) -> (a -> a -> a) -> [a] -> [a]
const combineEqual = (equalityCheck, combineFn, arr) => R.reduce((acc, currentItem) => {
  const index = R.findIndex(equalityCheck(currentItem), acc);

  if (R.equals(-1, index)) return R.append(currentItem, acc);

  const indexLens = R.lensIndex(index);
  return R.over(indexLens, combineFn(currentItem), acc);
}, [], arr);

module.exports = R.curry(combineEqual);
