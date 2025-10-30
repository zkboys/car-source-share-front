import {match} from 'path-to-regexp';
import pagesConfig from "~pages-config";
import type {ConfigOptions} from "@/config-hoc/types";

export type PageConfig = ConfigOptions & {
  filePath: string;
  conventionalRoutePath: string;
  routePath: string;
}

export function getPageConfig(pathname: string = window.location.pathname): PageConfig {
  if (!pathname) return ({}) as PageConfig;

  const cfg = pagesConfig?.find(item => {
    if (!item.routePath) return false;

    return match(item.routePath)(pathname);
  });

  return (cfg || {}) as PageConfig;
}

/**
 * 提取字符串中的数字
 * @param str 输入字符串，如 "$3.2万"
 * @returns 提取的数字，如 3.2
 */
export function extractNumber(str: string): number {
  // 使用正则表达式匹配数字（包括小数点）
  const match = str.match(/(\d+\.?\d*)/);

  if (match && match[1]) {
    return parseFloat(match[1]);
  }

  return 0;
}
