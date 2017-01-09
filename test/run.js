const send = require('../handler').send;
const event = require('./custom-event.json');

console.log('\n Running... \n');

const callback = (err, res) => {
  if (err) {
    console.error(err);
    throw err;
  }

  return console.log(res);
};

send(event, null, callback);
