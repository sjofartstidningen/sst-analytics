const { join } = require('path');
const { renderFile } = require('pug');
const { promisify } = require('bluebird');
const numeral = require('numeral');
const { truncate, capitalize } = require('lodash');

const renderFileAsync = promisify(renderFile);

numeral.register('locale', 'sv', {
  delimiters: { thousands: '.', decimal: ',' },
  abbreviations: { thousand: 'k', million: 'm', billion: 'b', trillion: 't' },
  ordinal: number => number,
  currency: { symbol: 'SEK' },
});

numeral.locale('sv');

module.exports = (data) => {
  const templatePath = join(__dirname, '../../template', 'template.pug');
  const opts = Object.assign({}, {
    pretty: false,
    formatNum: num => numeral(num).format('0,0'),
    formatPerc: num => numeral(num).format('+0,0.0%'),
    formatPercNoSign: num => numeral(num).format('0,0.0%'),
    truncateTitle: str => truncate(str, { length: 33 }),
    capitalize,
    getRelativeUrl: (fullUrl) => {
      if (!fullUrl) return fullUrl;

      const relativeUrl = fullUrl.replace('http://www.sjofartstidningen.se', '');
      return truncate(relativeUrl, { length: 33 });
    },
  }, data);

  return renderFileAsync(templatePath, opts);
};
