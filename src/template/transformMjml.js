const { mjml2html } = require('mjml');

module.exports = (templateString) => {
  const { html, errors } = mjml2html(templateString);

  if (errors.length > 0) {
    throw new Error(errors);
  }

  return html;
};
