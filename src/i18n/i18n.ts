import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import locale from './locales';

// 系统可用语言列表
export const localeOptions = locale;

if (!i18n.isInitialized) {
  i18n
    // 自动检测语言 加载的时候，会自动选择上次用户使用语言
    .use(LanguageDetector)
    // 绑定 react-i18next
    .use(initReactI18next)
    .init({
      // 多语言资源
      resources: localeOptions.reduce((prev, curr) => {
        const { value, translation } = curr;

        return {
          ...prev,
          [value]: { translation },
        };
      }, {}),
      // resources: {
      //   en: { translation: en },
      //   zh: { translation: zh },
      // },
      // 默认语言
      fallbackLng: 'zh-CN',
      debug: true,

      interpolation: {
        // React 已经处理 XSS，不需要转义
        escapeValue: false,
      },

      detection: {
        // 配置语言检测策略
        order: ['localStorage', 'cookie', 'navigator'],
        // 用户手动切换语言后会被存储
        caches: ['localStorage', 'cookie'],
      },
    })
    .then();
}

// 做次包装，业务代码中不直接使用 i18n，方便后续统一拦截、扩展

// 翻译函数
export function t(key: string, options?: any): string {
  // @ts-ignore
  return i18n.t(key, options);
}

// 当前语言
export const language = i18n.language;

// 切换语言
export async function changeLanguage(lng: string) {
  return i18n.changeLanguage(lng);
}

/**
 1. 文案、图片、暂未付、语言顺序
 2. 时间与日期格式
 3. 数字与货币格式
 4. 地区与单位
 5. 数字与排序规则
 6. 输入与输出格式
 7. 布局与方向
 8. 可访问性与文化适配
 */
