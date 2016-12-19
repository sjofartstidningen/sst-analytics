// @flow
import axios from 'axios';
import env from '../../env';
import { baseUrl } from './generateUrl';

const MC_KEY = env('MC_KEY');
const MC_USER = env('MC_USER');

export default axios.create({
  baseURL: baseUrl(),
  auth: {
    username: MC_USER,
    password: MC_KEY,
  },
});
