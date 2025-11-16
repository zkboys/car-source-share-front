import type { AxiosInstance, AxiosRequestConfig } from 'axios';

export function normalizeAxios(instance: AxiosInstance) {
  return {
    get: async (url: string, params?: any, config: AxiosRequestConfig = {}) => {
      const _url = setUrlPathParams(url, params);
      const res = await instance.get(_url, {
        params,
        ...config,
      });
      return res.data;
    },
    post: async (url: string, data?: any, config: AxiosRequestConfig = {}) => {
      const _url = setUrlPathParams(url, data);
      const res = await instance.post(_url, data, config);
      return res.data;
    },
    put: async (url: string, data?: any, config: AxiosRequestConfig = {}) => {
      const _url = setUrlPathParams(url, data);
      const res = await instance.put(_url, data, config);
      return res.data;
    },
    delete: async (
      url: string,
      params?: any,
      config: AxiosRequestConfig = {},
    ) => {
      const _url = setUrlPathParams(url, params);
      const res = await instance.delete(_url, config);
      return res.data;
    },
    patch: async (url: string, data?: any, config: AxiosRequestConfig = {}) => {
      const _url = setUrlPathParams(url, data);
      const res = await instance.patch(_url, data, config);
      return res.data;
    },
  };
}

/**
 * 处理url中的参数 「:id」或「{id}」
 * @param url
 * @param pathParams
 * @returns {*}
 */
export function setUrlPathParams(
  url: string,
  pathParams: { [x: string]: any },
) {
  if (!url) return url;
  if (!url.includes(':') || !url.includes('{')) return url;

  const urls = url.split('/');
  return urls
    .map((item) => {
      if (!item.startsWith(':') && !item.startsWith('{')) return item;

      const key = item.replace(':', '').replace('{', '').replace('}', '');

      // 如果参数不是object 直接将params作为value
      if (typeof pathParams !== 'object') {
        const value = pathParams;
        // @ts-ignore
        pathParams = null;

        return value;
      }

      if (!(key in pathParams)) throw Error(`缺少「${key}」参数`);

      return pathParams[key];
    })
    .join('/');
}
