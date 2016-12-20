import googleReport from './google/report';
import mailchimpReport from './mailchimp/report';

export default async () => ({
  google: await googleReport(),
  mailchimp: await mailchimpReport(),
});
