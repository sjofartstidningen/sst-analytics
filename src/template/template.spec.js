import test from 'blue-tape';
import cheerio from 'cheerio';
import generateEmail from '../template';
import transformPug from './transformPug';
import transformMjml from './transformMjml';
import report from '../../test/report-example.json';

test.skip('Template: generateEmail()', (t) => {
  generateEmail();
  t.end();
});

test('Template: transformPug()', async (t) => {
  const result = await transformPug(report);
  const $ = cheerio.load(result);

  {
    const should = 'Should generate an MJML template from Pug with 9 <mj-section>';
    const actual = $('mj-section').length;
    const expected = 9;

    t.equal(actual, expected, should);
  }

  {
    const should = 'Should generate correct data';
    const actual = [
      $('mj-text[mj-class="header subheader"]').text().trim(),
      $('mj-text[mj-class="list-text"]').first().html().trim(),
      $('mj-text[mj-class="list-text"]').last().html().trim(),
    ];
    const expected = [
      'vecka 50 – 2016',
      '18.323<span class="label red">-1,3%</span>',
      '12,8%',
    ];

    t.deepEqual(actual, expected, should);
  }
});

test('Template: transformMjml()', async (t) => {
  const templateString = await transformPug(report);
  const result = transformMjml(templateString);

  {
    const should = 'Should not throw an error';
    t.doesNotThrow(() => transformMjml(templateString), should);
  }

  {
    const should = 'Should return a string of html';
    const actual = typeof result;
    const expected = 'string';

    t.equal(actual, expected, should);
  }
});
