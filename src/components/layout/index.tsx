import type {ReactNode} from "react";
import {getPageConfig} from "@/commons";

export type LayoutProps = {
  children: ReactNode
}

export function Layout(props: LayoutProps) {
  const {children} = props;
  const {layout = true} = getPageConfig();

  if (!layout) return children;

  return children
}
