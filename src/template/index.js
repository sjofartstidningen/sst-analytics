import transformPug from './transformPug';
import transformMjml from './transformMjml';

export default async (report) => {
  const mjmlTemplate = await transformPug(report);
  const html = transformMjml(mjmlTemplate);

  return html;
};
