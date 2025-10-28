import type {ReactNode} from "react";
import s from './index.module.less';
import c from 'classnames';

export type PageContentProps = {
  className?: string;
  children?: ReactNode;
}

export function PageContent(props: PageContentProps) {
  const {children, className, ...others} = props;

  return (
    <div className={c(s.root, className)} {...others}>{children}</div>
  )
}
