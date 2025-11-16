import {extractNumber, getDataByLanguage, px} from '@/commons';
import {DropdownSelect, DropdownSelectItemType, PageContent,} from '@/components';
import {config} from '@/config-hoc';
import {useFunction} from '@/hooks';
import {t} from '@/i18n';
import {ErrorBlock, ImageViewer} from 'antd-mobile';
import {CSSProperties, useCallback, useEffect, useRef, useState} from 'react';
import {AutoSizer, List as VirtualizedList, WindowScroller,} from 'react-virtualized';
import {CarCard, Header} from './components';
import s from './index.module.less';
import {ajax} from "@/commons/ajax";
import {CarSource, Company} from '@/types';

type HomeProps = {
  title: string;
};

type DropdownValueType = {
  sorter: string;
  brand: string[];
  source: string[];
  deliveryType: string[];
};

export default config<HomeProps>({
  title: t('common.title'),
})(Home);

const initItems = [
  {
    key: 'sorter',
    title: t('common.sort'),
    children: [
      {key: 'all', title: t('common.defaultSort')},
      {key: 'desc', title: t('common.exportPriceHighest')},
      {key: 'asc', title: t('common.exportPriceLowest')},
    ],
  },
  {
    key: 'brand',
    title: t('common.brand'),
    multiple: true,
    children: [{key: 'all', title: t('common.allBrand')}],
  },
  {
    key: 'source',
    title: t('common.carSource'),
    multiple: true,
    children: [{key: 'all', title: t('common.allCarSource')}],
  },
  {
    key: 'deliveryType',
    title: t('common.deliveryType'),
    multiple: true,
    children: [{key: 'all', title: t('common.allDeliveryType')}],
  },
];

// Home必须单独定义，否则会影响 hot updated
function Home() {
  const [loading, setLoading] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<DropdownValueType>({
    sorter: 'all',
    brand: ['all'],
    source: ['all'],
    deliveryType: ['all'],
  });
  const [originDataSource, setOriginDataSource] = useState<CarSource[]>([]);
  const [dataSource, setDataSource] = useState<CarSource[]>([]);
  const [items, setItems] = useState<DropdownSelectItemType[]>(initItems);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const imageViewerRef = useRef<any>(null);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [company, setCompany] = useState<Company>()

  // 获取顶层查询条件项
  const getItems = useFunction((originDataSource: CarSource[]) => {
    setItems((items: DropdownSelectItemType[]) => {
      const brandList: string[] = [];
      const sourceList: string[] = [];
      const deliveryTypeList: string[] = [];

      originDataSource.forEach((item) => {
        const {brand, deliveryCity, deliveryType} = item;
        if (brand && !brandList.includes(brand)) {
          brandList.push(brand);
        }
        if (deliveryCity && !sourceList.includes(deliveryCity)) {
          sourceList.push(deliveryCity);
        }

        if (deliveryType && !deliveryTypeList.includes(deliveryType)) {
          deliveryTypeList.push(deliveryType);
        }
      });

      const brandItems = items.find((it) => it.key === 'brand')!;
      const sourceItems = items.find((it) => it.key === 'source')!;
      const deliveryTypeItems = items.find((it) => it.key === 'deliveryType')!;

      brandItems.children = [
        {key: 'all', title: t('common.allBrand')},
        ...brandList.map((b) => ({key: b, title: b})),
      ];

      sourceItems.children = [
        {key: 'all', title: t('common.allCarSource')},
        ...sourceList.map((s) => ({key: s, title: s})),
      ];

      deliveryTypeItems.children = [
        {key: 'all', title: t('common.allDeliveryType')},
        ...deliveryTypeList.map((s) => ({key: s, title: s})),
      ];

      return [...items];
    });
  });

  // 查询公司数据
  useEffect(() => {
    (async () => {
      const res = await ajax.get('/company');
      setCompany(getDataByLanguage<Company>(res.data));
    })()
  }, []);

  // 基于查询条件过滤数据
  useEffect(() => {
    const {sorter, brand, source, deliveryType} = dropdownValue;

    const nextDataSource = originDataSource.filter((item: CarSource) => {
      const isBrand = brand.includes('all')
        ? true
        : brand.some((key: string) => item.brand === key);
      const isSource = source.includes('all')
        ? true
        : source.some((key: string) => item.deliveryCity === key);

      const isDeliveryType = deliveryType.includes('all')
        ? true
        : deliveryType.some((key: string) => item.deliveryType === key);

      return isBrand && isSource && isDeliveryType;
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

  // 初始化查询数据
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await ajax.get('/car/source');
        const originDataSource = Array.isArray(res.data)
          ? res.data
          : [];

        const nextDataSource = originDataSource.map((item: any) => {
          return getDataByLanguage(item);
        });

        setOriginDataSource(nextDataSource);
        getItems(nextDataSource);
      } finally {
        setLoading(false);
      }
    })();
  }, [getItems]);

  // 必须使用 useCallback 否则排序时， dataSource.length 不改变，会导致 VirtualizedList 不渲染
  const rowRenderer = useCallback(
    (options: { index: number; key: string; style: CSSProperties }) => {
      const {index, key, style} = options;
      const item = dataSource[index];

      return (
        <div key={key} style={style}>
          <CarCard
            data={item}
            onImageClick={(images, index: number) => {
              setViewerImages(images);
              imageViewerRef.current.swipeTo(index);
              setViewerVisible(true);
            }}
          />
        </div>
      );
    },
    [dataSource],
  );

  return (
    <PageContent className={s.root} loading={loading}>
      <div className={s.top}>
        <Header company={company}/>
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
        ) : (
          // : dataSource.map((_item, index) => rowRenderer({ index, key: `${index}`, style: {} }))
          /* @ts-ignore */
          <WindowScroller>
            {({height, isScrolling, onChildScroll, scrollTop}) => (
              /* @ts-ignore */
              <AutoSizer disableHeight>
                {({width}) => (
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
                    rowHeight={px(228)}
                    overscanRowCount={2}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </div>
      <ImageViewer.Multi
        ref={imageViewerRef}
        getContainer={() => document.body}
        images={viewerImages}
        visible={viewerVisible}
        defaultIndex={viewerIndex}
        onIndexChange={(index) => setViewerIndex(index)}
        onClose={() => setViewerVisible(false)}
      />
    </PageContent>
  );
}
