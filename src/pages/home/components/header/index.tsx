import s from "./index.module.less";
export function Header() {
  return (
    <div className={s.root}>
      <img className={s.logo} src="/logo2x.png" alt="logo" />
      <div className={s.title}>卡泰驰汽车出口</div>
    </div>
  );
}
