import s from "./index.module.less";
import {Company} from "@/types";

export type HeaderProps = {
  company?: Company;
};

export function Header(props: HeaderProps) {
  const {company} = props;
  return (
    <div className={s.root}>
      <img className={s.logo} src={company?.logo} alt="logo"/>
      <div className={s.title}>{company?.companyName}</div>
    </div>
  );
}
