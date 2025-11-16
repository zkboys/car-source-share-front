import axios, {AxiosRequestHeaders} from 'axios';
import {normalizeAxios} from "@/commons/normalize-axios.ts";

const instance = axios.create({
  baseURL: '/api',
});

instance.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {} as AxiosRequestHeaders;
  config.headers['x-company-id'] = 'ktc';

  return config;
});

export const ajax = normalizeAxios(instance);
