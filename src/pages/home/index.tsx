import { useState, useEffect, CSSProperties } from 'react';
import s from './index.module.less';
import { config } from "@/config-hoc";
import { PageContent, DropdownSelect, DropdownSelectItemType } from "@/components";
import { CarCard, type CarSource, Header } from "./components";
import { ErrorBlock } from "antd-mobile";
import axios from 'axios';
import { extractNumber, getPxByVw } from "@/commons";
import { localeOptions, language, changeLanguage, t } from '@/i18n';
import { useFunction } from '@/hooks';
import { List as VirtualizedList, AutoSizer, WindowScroller } from 'react-virtualized'


type HomeProps = {
  title: string;
}

type DropdownValueType = {
  sorter: string,
  brand: string[],
  source: string[],
  language: string,
};

export default config<HomeProps>({
  title: t('home.title'),
})(Home);

// Home必须单独定义，否则会影响 hot updated
function Home() {
  const [loading, setLoading] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<DropdownValueType>({
    sorter: 'all',
    brand: ['all'],
    source: ['all'],
    language: language,
  });
  const [originDataSource, setOriginDataSource] = useState<CarSource[]>([]);
  const [dataSource, setDataSource] = useState<CarSource[]>([]);
  const [items, setItems] = useState<DropdownSelectItemType[]>([
    {
      key: 'sorter',
      title: t('home.sort'),
      children: [
        { key: 'all', title: t('home.defaultSort') },
        { key: 'desc', title: t('home.exportPriceHighest') },
        { key: 'asc', title: t('home.exportPriceLowest') },
      ],
    },
    {
      key: 'brand',
      title: t('home.brand'),
      multiple: true,
      children: [
        { key: 'all', title: t('home.allBrand') },
      ],
    },
    {
      key: 'source',
      title: t('home.carSource'),
      multiple: true,
      children: [
        { key: 'all', title: t('home.allCarSource') },
      ],
    },
    {
      key: 'language',
      title: t('home.language'),
      children: localeOptions.map(item => ({ key: item.value, title: item.label })),
    },
  ]);

  useEffect(() => {
    changeLanguage(dropdownValue.language);
  }, [dropdownValue.language]);

  useEffect(() => {
    const { sorter, brand, source } = dropdownValue;
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

    setDataSource(nextDataSource);
  }, [dropdownValue, originDataSource]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get('/data/car-source.json');
        const originDataSource = Array.isArray(res.data) ? res.data : [];
        originDataSource.forEach(item => {
          const { carPhoto } = item;

          if (typeof carPhoto === 'string') {
            item.carPhoto = carPhoto.split(' ');
          }
        });
        setOriginDataSource(originDataSource);

        setItems((items: DropdownSelectItemType[]) => {
          const brand: string[] = [];
          const source: string[] = [];

          originDataSource.forEach((item) => {
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
            { key: 'all', title: t('home.allBrand') },
            ...brand.map(b => ({ key: b, title: b }))
          ];

          sourceItems.children = [
            { key: 'all', title: t('home.allCarSource') },
            ...source.map(s => ({ key: s, title: s }))
          ];

          return [...items];
        });
      } finally {
        setLoading(false);
      }
    })()
  }, []);

  const rowRenderer = useFunction(({
    index,
    key,
    style,
  }: {
    index: number
    key: string
    style: CSSProperties
  }) => {
    const item = dataSource[index];

    return (
      <div key={key} style={style}>
        <CarCard {...item} />
      </div>
    );
  });

  return (
    <PageContent className={s.root} loading={loading}>
      <div className={s.top}>
        <Header />
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
          // : dataSource.map((_item, index) => rowRenderer({ index, key: `${index}`, style: {} }))
          : (
            /* @ts-ignore */
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                /* @ts-ignore */
                <AutoSizer disableHeight>
                  {({ width }) => (
                    /* @ts-ignore */
                    <VirtualizedList
                      autoHeight
                      height={height}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}
                      rowCount={dataSource.length}
                      rowRenderer={rowRenderer}
                      width={width}
                      rowHeight={getPxByVw(216)}
                      overscanRowCount={2}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )
        }
      </div>
    </PageContent>
  )
}
