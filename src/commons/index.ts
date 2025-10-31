import { match } from "path-to-regexp";
import pagesConfig from "~pages-config";
import type { ConfigOptions } from "@/config-hoc/types";

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
/**
 * Convert px to vw based on viewport width
 * @param px - The pixel value to convert
 * @param viewportWidth - The viewport width in pixels (default: 375)
 * @returns The converted value in vw units as a string
 */
export function pxToVw(px: number, viewportWidth: number = 375): string {
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
  viewportWidth: number = 375
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
export function getPxByVw(oldPx: number, baseWidth: number = 375): number {
  return (window.innerWidth / baseWidth) * oldPx;
}
