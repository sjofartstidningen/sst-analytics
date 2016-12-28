import { join } from 'path';
import { renderFile } from 'pug';
import { promisify } from 'bluebird';
import numeral from 'numeral';
import { truncate, capitalize } from 'lodash';

const renderFileAsync = promisify(renderFile);

numeral.register('locale', 'sv', {
  delimiters: { thousands: '.', decimal: ',' },
  abbreviations: { thousand: 'k', million: 'm', billion: 'b', trillion: 't' },
  ordinal: number => number,
  currency: { symbol: 'SEK' },
});

numeral.locale('sv');

export default async (data) => {
  const templatePath = join(__dirname, 'template.pug');
  const opts = Object.assign({}, {
    pretty: false,
    formatNum: num => numeral(num).format('0,0'),
    formatPerc: num => numeral(num).format('+0,0.0%'),
    formatPercNoSign: num => numeral(num).format('0,0.0%'),
    truncateTitle: str => truncate(str, { length: 33 }),
    capitalize,
    getRelativeUrl: (fullUrl) => {
      const relativeUrl = fullUrl.replace('http://www.sjofartstidningen.se', '');
      return truncate(relativeUrl, { length: 33 });
    },
  }, data);

  try {
    const rendered = await renderFileAsync(templatePath, opts);
    return rendered;
  } catch (err) {
    throw err;
  }
};
