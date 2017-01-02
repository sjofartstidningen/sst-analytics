'use strict';
const createAndSend = require('./lib').default;

module.exports.run = (event, context, callback) => {
  createAndSend()
    .then(res => callback(null, res))
    .catch(err => callback(err));
};
