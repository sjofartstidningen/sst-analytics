module.exports.schedule = {
  dev: {
    name: 'hourly',
    description: 'Triggered every hour',
    rate: 'rate(60 minutes)',
  },
  production: {
    name: 'mondays-07',
    description: 'Triggered every monday at 07:00',
    rate: 'cron(0 7 ? * MON *)',
  },
};
