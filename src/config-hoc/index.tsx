import React from 'react';
import type {Info, ConfigOptions} from "./types";
import useTitle from './useTitle';
import useAjax from './useAjax';
import useAuth from "./useAuth";
import usePermission from "./usePermission";

// 中间件
const middlewares = [
  useAuth,
  useTitle,
  useAjax,
  usePermission,
]

/**
 * 插拔式混合高阶组件
 * @param options
 */
export function config<T = any>(options?: ConfigOptions<T>) {
  return function withConfig<P extends object>(Component: React.ComponentType<P>): React.NamedExoticComponent<P> {
    const WrappedComponent: React.FC<P> = (props) => {

      const next: Info<P> = middlewares.reduce((prev, fn) => fn(prev), {
        Component,
        props,
        options: options as ConfigOptions<P> | undefined || {},
      })

      return <next.Component {...next.props} />;
    };

    WrappedComponent.displayName = `WithConfig(${Component.displayName || Component.name || 'Component'})`;

    return React.memo(WrappedComponent);
  };
}

