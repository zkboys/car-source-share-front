import React from 'react';
import { ConfigProvider } from "antd-mobile";
import { getLocales } from '@/i18n';

const { antLocale } = getLocales();

export interface LocaleProviderProps {
  children: React.ReactNode;
}

export function LocaleProvider(props: LocaleProviderProps) {
  const { children } = props;

  return (
    <ConfigProvider locale={antLocale}>
      {children}
    </ConfigProvider>
  );
}
