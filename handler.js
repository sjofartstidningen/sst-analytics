require('dotenv').config({ silent: true });
const createAndSend = require('./lib/createAndSend');

module.exports.send = (event, context, callback) => {
  const today = new Date();
  createAndSend(today)
    .then(res => callback(null, res))
    .catch(err => callback(err));
};
