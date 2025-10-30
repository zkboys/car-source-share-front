import merge from 'lodash/merge';
import type {Config} from '@/config/types';
import {envEnum} from './env-enum';
import configDefault from './config-default';
import configDevelopment from './config-development';
import configTest from './config-test';
import configProduction from './config-production';
import configPreview from './config-preview';

const env = import.meta.env.VITE_RUN_ENV || envEnum.DEVELOPMENT;

const envConfig = {
  [envEnum.DEVELOPMENT]: configDevelopment,
  [envEnum.TEST]: configTest,
  [envEnum.PRODUCTION]: configProduction,
  [envEnum.PREVIEW]: configPreview,
}[env];

export const isDev = env === envEnum.DEVELOPMENT;

export const CONFIG = merge({}, configDefault, envConfig) as Config;
