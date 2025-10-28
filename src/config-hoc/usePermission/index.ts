import type {Info} from "@/config-hoc/types";
import Error403 from "@/pages/error-403";

// TODO 未完成
export default function usePermission<P extends object>(info: Info<P>): Info<P> {
  const {props, options} = info;
  if (options?.permission === undefined) return info;

  return {Component: Error403, props, options};
}
