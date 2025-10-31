import dayjs from "dayjs";
import ant_en_US from "antd-mobile/es/locales/en-US";
import ant_zh_CN from "antd-mobile/es/locales/zh-CN";

import { language } from "./index";

/**
 * 获取或设置项目中第三方库使用的语言
 */
export function getLocales() {
  // 英文
  if (language.startsWith("en")) {
    import("dayjs/locale/en");
    dayjs.locale("en");
    return {
      antLocale: ant_en_US,
    };
  }

  // 默认中文
  import("dayjs/locale/zh-cn");
  dayjs.locale("zh-cn");
  return {
    antLocale: ant_zh_CN,
  };
}
