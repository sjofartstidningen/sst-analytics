const test = require('blue-tape');
const R = require('ramda');
const sendCampaign = require('../send-campaign');
const removeCampaign = require('../../test/utils/removeCampaign');
const report = require('../../test/report-example.json');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(process.cwd(), 'test', 'html-example.html'), 'utf-8');
const propType = R.compose(R.type, R.prop);

test('SEND: campaign', t => sendCampaign(report, html)
  .then((res) => {
    const should = 'Should create and send a campaign and return status OK';
    const actual = [propType('id', res), R.prop('status', res), propType('subject', res)];
    const expected = ['String', 'ok', 'String'];

    t.deepEqual(actual, expected, should);
    return R.prop('id', res);
  })
  .then(id => removeCampaign(id)));
