require('dotenv').config({ silent: true });
const createAndSend = require('./lib/createAndSend');

module.exports.send = (event, context, callback) => {
  const today = new Date(event.time);

  createAndSend(today)
    .then((res) => {
      const ret = Object.assign({}, res, { date: today, env: process.env.NODE_ENV });
      return callback(null, ret);
    })
    .catch(err => callback(err));
};
