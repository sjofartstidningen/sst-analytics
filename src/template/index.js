const R = require('ramda');
const transformPug = require('./transformPug');
const transformMjml = require('./transformMjml');

module.exports = R.composeP(transformMjml, transformPug);
