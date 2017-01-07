const transformPug = require('./transformPug');
const transformMjml = require('./transformMjml');

module.exports = async (report) => {
  const mjmlTemplate = await transformPug(report);
  const html = transformMjml(mjmlTemplate);

  return html;
};
