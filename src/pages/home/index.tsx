import {useState, useEffect} from 'react';
import s from './index.module.less';
import {config} from "@/config-hoc";
import {PageContent, DropdownSelect} from "@/components";
import {CarCard, type CarSource} from "./components";
import {ErrorBlock, Toast} from "antd-mobile";
import axios from 'axios';
import {extractNumber} from "@/commons";

type HomeProps = {
  title: string;
}

type ItemType = {
  key: string,
  title: string,
  multiple?: boolean,
  children?: ItemType[],
}

type DropdownValueType = {
  sorter: string,
  brand: string[],
  source: string[],
  language: string,
};

export default config<HomeProps>({
  title: '卡泰驰汽车出口',
})(Home);

// Home必须单独定义，否则会影响 hot updated
function Home() {
  const [loading, setLoading] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<DropdownValueType>({
    sorter: 'all',
    brand: ['all'],
    source: ['all'],
    language: 'zh-CN',
  });
  const [originDataSource, setOriginDataSource] = useState<CarSource []>([]);
  const [dataSource, setDataSource] = useState<CarSource []>([]);
  const [items, setItems] = useState<ItemType[]>([
    {
      key: 'sorter',
      title: '默认排序',
      children: [
        {key: 'all', title: '默认排序'},
        {key: 'desc', title: '出口价格最高'},
        {key: 'asc', title: '出口价格最低'},
      ],
    },
    {
      key: 'brand',
      title: '品牌',
      multiple: true,
      children: [
        {key: 'all', title: '所有品牌'},
      ],
    },
    {
      key: 'source',
      title: '车源',
      multiple: true,
      children: [
        {key: 'all', title: '全国可提'},
      ],
    },
    {
      key: 'language',
      title: '中文',
      children: [
        {key: 'zh-CN', title: '🇨🇳 简体中文'},
        {key: 'en-US', title: '🇬🇧 English'},
      ],
    },
  ]);

  useEffect(() => {
    if (dropdownValue.language === 'en-US') {
      Toast.show({
        content: '语言切换待上线...',
      })
      setDropdownValue(val => {
        return {...val, language: 'zh-CN'}
      })
    }
  }, [dropdownValue.language]);

  useEffect(() => {
    const {sorter, brand, source} = dropdownValue;
    const nextDataSource = originDataSource.filter((item: CarSource) => {
      const isBrand = brand.includes('all') ? true : brand.some((key: string) => item.brand === key);
      const isSource = source.includes('all') ? true : source.some((key: string) => item.deliveryCity === key);

      return isBrand && isSource;
    });
    nextDataSource.sort((a, b) => {
      const aTime = a.createTime || '';
      const bTime = b.createTime || '';
      const aPrice = extractNumber(a.exportPrice);
      const bPrice = extractNumber(b.exportPrice);

      if (sorter === 'all') {
        if (bTime > aTime) return 1;
        if (bTime < aTime) return -1;
        return 0;
      }
      if (sorter === 'desc') {
        if (bPrice > aPrice) return 1;
        if (bPrice < aPrice) return -1;
        return 0;
      }
      if (sorter === 'asc') {
        if (bPrice > aPrice) return -1;
        if (bPrice < aPrice) return 1;
        return 0;
      }
      return 0;
    });

    console.log(nextDataSource);
    setDataSource(nextDataSource);
  }, [dropdownValue, originDataSource]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get('/data/car-source.json');
        const dataSource = Array.isArray(res.data) ? res.data : [];
        setOriginDataSource(dataSource);

        setItems((items: ItemType[]) => {
          const brand: string[] = [];
          const source: string[] = [];

          dataSource.forEach((item) => {
            if (item.brand && !brand.includes(item.brand)) {
              brand.push(item.brand);
            }
            if (item.deliveryCity && !source.includes(item.deliveryCity)) {
              source.push(item.deliveryCity);
            }
          });

          const brandItems = items.find(it => it.key === 'brand')!;
          const sourceItems = items.find(it => it.key === 'source')!;

          brandItems.children = [
            {key: 'all', title: '所有品牌'},
            ...brand.map(b => ({key: b, title: b}))
          ];

          sourceItems.children = [
            {key: 'all', title: '全国可提'},
            ...source.map(s => ({key: s, title: s}))
          ];

          return [...items];
        });
      } finally {
        setLoading(false);
      }
    })()
  }, []);

  return (
    <PageContent className={s.root} loading={loading}>
      <div className={s.top}>
        <DropdownSelect
          value={dropdownValue}
          onChange={(value) => setDropdownValue(value as DropdownValueType)}
          items={items}
        />
      </div>
      <div className={s.content}>
        {!dataSource?.length ? (
            <ErrorBlock
              className={s.empty}
              status="empty"
              description="更换筛选条件试试"
              title="暂无数据"
            />
          )
          : dataSource.map((item: CarSource) => {
            const {id} = item;

            return <CarCard key={id} {...item} />;
          })}
      </div>
    </PageContent>
  )
}
