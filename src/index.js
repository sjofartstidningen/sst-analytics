import endOfWeek from 'date-fns/end_of_week';
import subDays from 'date-fns/sub_days';
import getReport from './report';
import getHtml from './template';
import send from './send-campaign';
import { log, error } from './config';

const today = new Date();
const endOfLastWeek = endOfWeek(subDays(today, 7));

export default async () => {
  log('Application starting');

  try {
    const report = await getReport(endOfLastWeek);
    const html = await getHtml(report);
    const res = await send(report, html);

    log('Message sent successfully');
    return res;
  } catch (err) {
    error('An error occured: %O', err);
    throw err;
  }
};
