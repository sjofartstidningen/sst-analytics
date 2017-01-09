require('dotenv').config();
const createAndSend = require('../lib/createAndSend');

const today = new Date();

console.log('\n Running... \n');
createAndSend(today)
  .then(res => console.log(res))
  .catch((err) => {
    console.error(err);
    throw err;
  });
