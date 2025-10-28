import s from './index.module.less';
import {Result} from "antd-mobile";

export default function Error404() {

  return (
    <div className={s.root}>
      <Result
        status="warning"
        title="404"
        description="很抱歉，您访问的页面不存在。"
      />
    </div>
  )
}
