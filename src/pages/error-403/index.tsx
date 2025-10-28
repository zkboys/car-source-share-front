import s from './index.module.less';
import {Result} from "antd-mobile";

export default function Error403() {
  return (
    <div className={s.root}>
      <Result
        status="warning"
        title="403"
        description="很抱歉，您无权访问此页面。"
      />
    </div>
  )
}
