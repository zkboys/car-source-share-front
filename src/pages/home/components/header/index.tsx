import s from "./index.module.less";
import { t } from "@/i18n";
export function Header() {
  return (
    <div className={s.root}>
      <img className={s.logo} src="/logo2x.png" alt="logo" />
      <div className={s.title}>{t('home.title')}</div>
    </div>
  );
}
