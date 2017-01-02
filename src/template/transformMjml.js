import { mjml2html } from 'mjml';

export default (templateString) => {
  const { html, errors } = mjml2html(templateString);

  if (errors.length > 0) {
    throw new Error(errors);
  }

  return html;
};
