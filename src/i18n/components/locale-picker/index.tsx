import { changeLanguage, language, localeOptions, t } from '@/i18n';
import { Picker } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import s from './index.module.less';

export function LocalePicker() {
  return (
    <Picker
      columns={[localeOptions]}
      value={[language]}
      onConfirm={(val) => {
        changeLanguage(val[0] as string);
      }}
    >
      {(_, actions) => {
        return (
          <div className={s.root}>
            <a className={s.text} onClick={actions.open}>
              {t('common.language')}
            </a>
            <DownFill />
          </div>
        );
      }}
    </Picker>
  );
}
