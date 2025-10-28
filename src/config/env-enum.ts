import {createEnum, type PickEnumValues} from '@/components';

export const envEnum = createEnum({
  DEVELOPMENT: ['development', '开发环境'],
  TEST: ['test', '测试环境'],
  PRODUCTION: ['production', '生产环境'],
  PREVIEW: ['preview', '预生产环境'],
});
export type envType = PickEnumValues<typeof envEnum>;
