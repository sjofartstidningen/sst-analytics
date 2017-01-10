require('dotenv').config({ silent: true });
const createAndSend = require('./lib/createAndSend');

module.exports.send = (event, context, callback) => {
  const today = new Date();

  createAndSend(today)
    .then((res) => {
      const ret = Object.assign({}, res, { date: today });
      return callback(null, ret);
    })
    .catch(err => callback(err));
};
