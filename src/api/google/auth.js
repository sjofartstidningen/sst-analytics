// @flow
import google from 'googleapis';

export default (
  clientEmail: string,
  privateKey: string,
): Promise<GAjwt> => new Promise((resolve, reject) => {
  const jwtClient: GAjwt = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/analytics'],
    null,
  );

  jwtClient.authorize((err) => {
    if (err) return reject(err);
    return resolve(jwtClient);
  });
});
