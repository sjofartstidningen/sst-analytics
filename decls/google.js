declare type GAjwt = {
  authorize: () => void,
};

declare type GApayload = {
  auth: GAjwt,
  accountId: number,
  webPropertyId: string,
  profileId: number,
  ids: string,
  metrics: string,
  dimensions?: string,
  sort?: string,
  'max-results'?: number,
  'start-date': string,
  'end-date': string,
};
