import s from "./index.module.less";
import {Dialog} from "antd-mobile";
import {t} from "@/i18n";
import {ReactNode} from "react";
import c from 'classnames';

export type ContactDialogProps = {
  className?: string;
  contact?: string;
  number?: string;
  weChat?: string;
  children: ReactNode;
};

export function ContactDialog(props: ContactDialogProps) {
  const {contact, number, weChat, children, className} = props;

  return (
    <div
      className={c(s.contactWrap, className)}
      onClick={() =>
        Dialog.alert({
          className: s.weChatDialog,
          confirmText: t('common.iKnow'),
          content: (
            <div className={s.contactInfo}>
              {contact || number ? (
                <div>
                  {contact}：
                  <a className={s.number} href={`tel:${number}`}>
                    {number}
                  </a>
                </div>
              ) : null}
              <div className={s.weChat}>
                <img src={weChat} alt={t('common.weChatQrCode')}/>
              </div>
            </div>
          ),
        })
      }
    >
      {children}
    </div>
  );
}
