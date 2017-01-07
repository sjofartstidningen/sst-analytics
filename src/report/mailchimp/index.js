// @flow
import axios from 'axios';
import config from '../../config';
import { baseUrl } from './generateUrl';

const MC_KEY = config('MC_KEY');
const MC_USER = config('MC_USER');

export default axios.create({
  baseURL: baseUrl(),
  auth: {
    username: MC_USER,
    password: MC_KEY,
  },
});
