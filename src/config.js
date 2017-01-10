// @flow
const variables = {
  default: {
    NODE_ENV: process.env.NODE_ENV,
    GA_ACCOUNT_ID: 3566068,
    GA_WEB_PROPERTY: 'UA-3566068-1',
    GA_PROFILE_ID: 7009314,
    GA_PRIVATE_KEY: process.env.GA_PRIVATE_KEY,
    GA_CLIENT_EMAIL: 'sst-analytics@imposing-voyage-152523.iam.gserviceaccount.com',
    MC_KEY: process.env.MC_KEY,
    MC_USER: 'adambrgmn',
    MC_FOLDER_ID: 'b1714cc4bc',
  },
  production: { MC_LIST_ID: 'abdd15164f' }, // List of all employees
  development: { MC_LIST_ID: '15a43ccea6' }, // List of dev only
};

module.exports = (variable: string, defaultValue?: any): any => {
  const env = process.env.NODE_ENV || 'development';

  try {
    const foundVariable = variables[env][variable] || variables.default[variable];

    if (!foundVariable) return defaultValue;
    return foundVariable;
  } catch (err) {
    return defaultValue;
  }
};
