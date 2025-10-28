import s from './index.module.less';
import {config} from "@/config-hoc";
import {PageContent} from "@/components";
import {Button} from 'antd-mobile';

type HomeProps = {
  title: string;
}

export default config<HomeProps>({
  title: '卡泰驰汽车出口',
})(Home);


// Home必须单独定义，否则会影响 hot updated
function Home() {
  return (
    <PageContent className={s.root}>
      <Button>首页啊</Button>
      <div className={s.test}></div>
    </PageContent>
  )
}
