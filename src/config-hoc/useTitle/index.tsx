import {Helmet} from 'react-helmet-async';
import type {Info} from "@/config-hoc/types";
import {type ComponentType, useMemo} from "react";

export default function useTitle<P extends object>(info: Info<P>): Info<P> {
  const {props, options, Component} = info;

  const title = typeof options?.title === 'function' ? options.title(props) : options?.title;

  // 内部动态定义组件
  const Title = useMemo<ComponentType<P>>(() => {
    if (!title) return Component;

    // 命名组件
    return function WithTitle(props: P) {
      return (
        <>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <Component {...props} />
        </>
      );
    };
  }, [Component, title])

  return {
    ...info,
    Component: Title,
  };
}
