import {config} from '@/config-hoc';
import Home from './home';

export default config({
  title: '卡泰驰汽车出口',
  path: '/',
})(Index);

function Index() {
  return (
    <Home/>
  )
}
