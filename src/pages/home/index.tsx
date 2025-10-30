import {useState, useEffect} from 'react';
import s from './index.module.less';
import {config} from "@/config-hoc";
import {PageContent, DropdownSelect} from "@/components";
import {CarCard, type CarSource} from "./components";
import {ErrorBlock} from "antd-mobile";
import axios from 'axios';

type HomeProps = {
  title: string;
}

type ItemType = {
  key: string,
  title: string,
  multiple?: boolean,
  isAll?: boolean,
  children?: ItemType[],
}

type DropdownValueType = {
  sorter: string,
  brand: string[],
  source: string[],
};

export default config<HomeProps>({
  title: '卡泰驰汽车出口',
})(Home);

// Home必须单独定义，否则会影响 hot updated
function Home() {
  const [dropdownValue, setDropdownValue] = useState<DropdownValueType>({
    sorter: 'all',
    brand: ['all'],
    source: ['all'],
  });
  const [originDataSource, setOriginDataSource] = useState<CarSource []>([
    // {
    //   id: "1",
    //   carPhoto: "https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60",
    //   brand: "丰田",
    //   title: "凯美瑞 2023款 2.5L 豪华版",
    //   titleEn: "Camry 2023 2.5L Luxury Edition",
    //   guidePrice: 23.98,
    //   discountAmount: 2.5,
    //   exportMethod: "整船出口",
    //   exportPrice: 21.48,
    //   color: "珍珠白",
    //   deliveryType: "现车",
    //   deliveryCity: "上海",
    //   insuranceType: "全险",
    //   weChat: "https://example.com/images/wechat_qr.png",
    //   contact: "张经理",
    //   number: "13800138000"
    // }
  ]);
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
        {key: 'all', title: '所有品牌', isAll: true},
      ],
    },
    {
      key: 'source',
      title: '车源',
      multiple: true,
      children: [
        {key: 'all', title: '全国可提', isAll: true},
      ],
    },
  ]);

  useEffect(() => {
    const {sorter, brand, source} = dropdownValue;

    const nextDataSource = originDataSource.filter((item: CarSource) => {
      const isBrand = brand.includes('all') ? true : brand.some((key: string) => item.brand === key);
      const isSource = source.includes('all') ? true : source.some((key: string) => item.deliveryCity === key);

      return isBrand && isSource;
    });
    nextDataSource.sort((a, b) => {
      if (sorter === 'all') return 0;
      return sorter === 'desc' ? b.exportPrice - a.exportPrice : a.exportPrice - b.exportPrice;
    });

    setDataSource(nextDataSource);
  }, [dropdownValue, originDataSource]);

  useEffect(() => {
    (async () => {
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
          {key: 'all', title: '所有品牌', isAll: true},
          ...brand.map(b => ({key: b, title: b}))
        ];

        sourceItems.children = [
          {key: 'all', title: '全国可提', isAll: true},
          ...source.map(s => ({key: s, title: s}))
        ];

        return [...items];
      });
    })()
  }, []);

  return (
    <PageContent className={s.root}>
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
