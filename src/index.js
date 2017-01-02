import endOfWeek from 'date-fns/end_of_week';
import subDays from 'date-fns/sub_days';
import getReport from './report';
import getHtml from './template';
import send from './send-campaign';

const today = new Date();
const endOfLastWeek = endOfWeek(subDays(today, 7));

export default async () => {
  const report = await getReport(endOfLastWeek);
  const html = await getHtml(report);
  const res = await send(report, html);

  return res;
};
