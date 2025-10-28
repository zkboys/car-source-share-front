import {useEffect} from "react";
import type {Info} from "@/config-hoc/types";

// TODO 未完成
export default function useAjax<P extends object>(info: Info<P>): Info<P> {
  const {Component, props, options} = info;
  useEffect(() => {
    return () => {
      console.log('ajax打断');
    }
  }, []);

  if (!options?.ajax) return info;

  return {Component, props: {...props, ajax: {get: () => null}}, options};
}
