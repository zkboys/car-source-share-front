import s from "./index.module.less";
import {Company} from "@/types";
import {LocalePicker} from "@/i18n";
import {Ellipsis} from "antd-mobile";

export type HeaderProps = {
  company?: Company;
};

export function Header(props: HeaderProps) {
  const {company} = props;
  return (
    <div className={s.root}>
      <div className={s.info}>
        <img className={s.logo} src={company?.logo} alt="logo"/>
        <div className={s.title}>
          <Ellipsis direction="end" rows={1} content={company?.companyName || ''}/>
        </div>
      </div>
      <div className={s.local}>
        <LocalePicker/>
      </div>
    </div>
  );
}
