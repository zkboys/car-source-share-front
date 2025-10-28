import React from "react";

export type ConfigOptions<T = any> = {
  path?: string;
  layout?: boolean;
  auth?: boolean;
  title?: string | ((props: T) => string);
  parentTitle?: string;
  order?: number;
  ajax?: boolean;
  permission?: string | string[] | boolean;
};

export type Info<T = any> = {
  Component: React.ComponentType<T>,
  props: T,
  options: ConfigOptions<T>,
}
