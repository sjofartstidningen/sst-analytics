require('dotenv').config({ silent: true });
const createAndSend = require('./lib/createAndSend');

module.exports.send = (event, context, callback) => {
  const today = new Date(event.time);

  createAndSend(today)
    .then(res => callback(null, res))
    .catch(err => callback(err));
};
