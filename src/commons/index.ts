import {match} from "path-to-regexp";
import pagesConfig from "~pages-config";
import type {ConfigOptions} from "@/config-hoc/types";
import {CarSource} from "@/pages/home/components";
import {language} from "@/i18n";

export type PageConfig = ConfigOptions & {
  filePath: string;
  conventionalRoutePath: string;
  routePath: string;
};

export function getPageConfig(
  pathname: string = window.location.pathname
): PageConfig {
  if (!pathname) return {} as PageConfig;

  const cfg = pagesConfig?.find((item) => {
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
  if (!str) return 0;
  // 使用正则表达式匹配数字（包括小数点）
  const match = str.match(/(\d+\.?\d*)/);

  if (match && match[1]) {
    return parseFloat(match[1]);
  }

  return 0;
}

const VIEWPORT_WIDTH = 375;

/**
 * Convert px to vw based on viewport width
 * @param px - The pixel value to convert
 * @param viewportWidth - The viewport width in pixels (default: 375)
 * @returns The converted value in vw units as a string
 */
export function pxToVw(px: number, viewportWidth: number = VIEWPORT_WIDTH): string {
  // Skip conversion for values <= minPixelValue (1 in config)
  if (Math.abs(px) <= 1) {
    return `${px}px`;
  }

  // Calculate vw: (px / viewportWidth) * 100
  const vw = (px / viewportWidth) * 100;

  // Round to specified precision (6 in config)
  const roundedVw = Math.round(vw * 1000000) / 1000000;

  return `${roundedVw}vw`;
}

/**
 * Convert vw to px based on viewport width
 * @param vw - The vw value to convert (as string or number)
 * @param viewportWidth - The viewport width in pixels (default: 375)
 * @returns The converted value in px units as a string
 */
export function vwToPx(
  vw: string | number,
  viewportWidth: number = VIEWPORT_WIDTH
): string {
  // Extract numeric value from string (e.g., "5.333333vw" -> 5.333333)
  const vwValue =
    typeof vw === "string" ? parseFloat(vw.replace(/[^\d.-]/g, "")) : vw;

  // Calculate px: (vw / 100) * viewportWidth
  const px = (vwValue / 100) * viewportWidth;

  // Round to nearest integer or keep decimal based on needs
  const roundedPx = Math.round(px * 1000000) / 1000000;

  return `${roundedPx}px`;
}

/**
 * 基于窗口跨度，计算新的px尺寸
 * - 一般用于jsx中
 * @param oldPx
 * @param viewportWidth
 */
export function px(oldPx: number, viewportWidth: number = VIEWPORT_WIDTH): number {
  return (window.innerWidth / viewportWidth) * oldPx;
}

/**
 * 数据约定，field以En结尾的为英文
 * @param data
 * @param field
 */
export function getValueByLanguage(data: CarSource, field: string) {
  const isEn = language === 'en-US';
  const _field = isEn ? `${field}En` : field;
  // @ts-ignore
  return data[_field] || data[field] || '';
}

/**
 * 基于语言获取数据
 * @param data
 */
export function getDataByLanguage(data: CarSource) {
  Object.keys(data).forEach((key: string) => {
    if (key.endsWith('En')) return;

    // @ts-ignore
    data[key] = getValueByLanguage(data, key);
  });
  const {carPhoto} = data;

  if (typeof (carPhoto as any) === 'string') {
    data.carPhoto = (carPhoto as unknown as string).split(' ');
  }
  return data;
}
