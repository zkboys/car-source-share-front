import type {Info} from "@/config-hoc/types";

// TODO 未完成
export default function useAuth<P extends object>(info: Info<P>): Info<P> {
  const {options} = info;

  const {auth} = options || {};

  if (!auth) return info;


  // if(!isLogin()) return toLogin();

  return info;
}
