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
