module.exports.schedule = () => Object.assign({}, {
  production: {
    name: 'mondays-07',
    description: 'Triggered every monday at 07:00 AM',
    rate: 'cron(0 7 ? * MON *)',
  },
}, {
  dev: {
    name: 'hourly',
    description: 'Triggered every hour',
    rate: 'rate(60 minutes)',
  },
});
