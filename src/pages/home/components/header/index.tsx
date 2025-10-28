import s from "./index.module.less";
export function Header() {
  return (
    <div className={s.root}>
      <img className={s.logo} src="https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60" alt="logo" />
      <div className={s.title}>卡泰驰汽车出口</div>
    </div>
  );
}
