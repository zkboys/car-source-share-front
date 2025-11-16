import { normalizeAxios } from '@/commons/normalize-axios.ts';
import { CONFIG } from '@/config';
import axios, { AxiosRequestHeaders } from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

instance.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {} as AxiosRequestHeaders;
  config.headers['x-company-id'] = CONFIG.companyId;

  return config;
});

export const ajax = normalizeAxios(instance);
