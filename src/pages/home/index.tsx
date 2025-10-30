import { useState, useEffect } from 'react';
import s from './index.module.less';
import { config } from "@/config-hoc";
import { PageContent, DropdownSelect, type DropdownSelectValue } from "@/components";
import { CarCard, Header } from "./components";
import { Empty } from "antd-mobile";
import axios from 'axios';


type HomeProps = {
  title: string;
}

export default config<HomeProps>({
  title: '卡泰驰汽车出口',
})(Home);


// Home必须单独定义，否则会影响 hot updated
function Home() {
  const [dropdownValue, setDropdownValue] = useState<DropdownSelectValue>({
    sorter: 'all',
    brand: ['all'],
    source: ['all'],
  });
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get('/datasource.json');
      setDataSource(res.data);
    })()
  }, []);
  const items = [
    {
      key: 'sorter',
      title: '默认排序',
      children: [
        { key: 'all', title: '默认排序' },
        { key: 'desc', title: '价格最高' },
        { key: 'asc', title: '价格最低' },
      ],
    },
    {
      key: 'brand',
      title: '品牌',
      multiple: true,
      children: [
        { key: 'all', title: '所有品牌', isAll: true },
        { key: '01', title: '奥迪' },
        { key: '02', title: '阿维塔' },
        { key: '03', title: '大众' },
        { key: '04', title: '特斯拉' },
        { key: '05', title: '马自达' },
        { key: '06', title: '宝马' },
      ],
    },
    {
      key: 'source',
      title: '车源',
      multiple: true,
      children: [
        { key: 'all', title: '全国可提', isAll: true },
        { key: '01', title: '北京' },
        { key: '02', title: '上海' },
        { key: '03', title: '杭州' },
        { key: '04', title: '深圳' },
        { key: '05', title: '厂商' },
        { key: '06', title: '河北' },
      ],
    },
  ];

  return (
    <PageContent className={s.root}>
      {/* TODO 悬浮 */}
      <DropdownSelect
        value={dropdownValue}
        onChange={setDropdownValue}
        items={items}
      />
      <div className={s.content}>
        {!dataSource?.length ? <Empty description="暂无数据" /> : dataSource.map((item) => {
          const { id } = item;

          return <CarCard key={id} {...item} />;
        })}
      </div>
    </PageContent>
  )
}
