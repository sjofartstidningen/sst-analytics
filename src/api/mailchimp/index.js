// @flow
import R from 'ramda';
import axios from 'axios';
import env from '../../env';
import { baseUrl, reportUrl } from './generateUrl';

const MC_KEY = env('MC_KEY');
const MC_USER = env('MC_USER');

export const coreApi = axios.create({
  baseURL: baseUrl(),
  auth: {
    username: MC_USER,
    password: MC_KEY,
  },
});

export const getReport = async (campaignId: string): Promise<MCreport> => {
  const result = await coreApi(reportUrl(campaignId));
  const data: MCreport = result.data;

  return data;
};
