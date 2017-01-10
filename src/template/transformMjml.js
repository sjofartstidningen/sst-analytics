const { mjml2html } = require('mjml');

module.exports = templateString => new Promise((resolve, reject) => {
  const { html, errors } = mjml2html(templateString);
  if (errors.length > 0) return reject(errors);
  return resolve(html);
});
