import type {ReactNode} from "react";
import s from './index.module.less';
import c from 'classnames';
import {SpinLoading} from 'antd-mobile'
import {SafeArea} from 'antd-mobile'


export type PageContentProps = {
  className?: string;
  children?: ReactNode;
  loading?: boolean;
}

export function PageContent(props: PageContentProps) {
  const {children, className, loading, ...others} = props;

  return (
    <>
      {loading && <div className={s.loading}><SpinLoading color="primary"/></div>}
      <div className={c(s.root, className)} {...others}>
        <SafeArea position="top"/>
        {children}
        <SafeArea position="bottom"/>
      </div>
    </>
  )
}
