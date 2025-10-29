import {useState} from 'react';
import s from './index.module.less';
import {config} from "@/config-hoc";
import {PageContent, DropdownSelect, type DropdownSelectValue} from "@/components";
import {CarCard, type CarCardProps, Header} from "./components";
import {Empty} from "antd-mobile";

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
  const items = [
    {
      key: 'sorter',
      title: '默认排序',
      children: [
        {key: 'all', title: '默认排序'},
        {key: 'desc', title: '价格最高'},
        {key: 'asc', title: '价格最低'},
      ],
    },
    {
      key: 'brand',
      title: '品牌',
      multiple: true,
      children: [
        {key: 'all', title: '所有品牌', isAll: true},
        {key: '01', title: '奥迪'},
        {key: '02', title: '阿维塔'},
        {key: '03', title: '大众'},
        {key: '04', title: '特斯拉'},
        {key: '05', title: '马自达'},
        {key: '06', title: '宝马'},
      ],
    },
    {
      key: 'source',
      title: '车源',
      multiple: true,
      children: [
        {key: 'all', title: '全国可提', isAll: true},
        {key: '01', title: '北京'},
        {key: '02', title: '上海'},
        {key: '03', title: '杭州'},
        {key: '04', title: '深圳'},
        {key: '05', title: '厂商'},
        {key: '06', title: '河北'},
      ],
    },
  ];
  const testImage = 'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00086-934.jpg';
  // 测试数据数组
  const dataSource: CarCardProps[] = [
    {
      image: testImage,
      title: "睿蓝汽车X3 PRO 2024 款 1.5L CVT 小风 嘎嘎好看 你就买吧，一买一个不支持声",
      titleEn: "Tesla Model 3 Tesla Model 3 Tesla Model 3 Tesla Model 3 Tesla Model 3 Tesla Model 3",
      guidePrice: 35.99,
      discountAmount: 2.00,
      exportMethod: "海运",
      exportPrice: 320000,
      color: "珍珠白",
      deliveryType: "现车",
      deliveryCity: "上海",
      insuranceType: "全险",
      wechatId: "18611434363",
      wechatName: "张经理"
    },
    {
      image: testImage,
      title: "宝马 X5",
      titleEn: "BMW X5",
      guidePrice: 85.99,
      discountAmount: 5.00,
      exportMethod: "海运",
      exportPrice: 780000,
      color: "矿石灰",
      deliveryType: "现车",
      deliveryCity: "北京",
      insuranceType: "全险",
      wechatId: "bmw_sales_002",
      wechatName: "李经理"
    },
    {
      image: testImage,
      title: "奥迪 A6L",
      titleEn: "Audi A6L",
      guidePrice: 55.99,
      discountAmount: 3.50,
      exportMethod: "空运",
      exportPrice: 500000,
      color: "冰川白",
      deliveryType: "期货",
      deliveryCity: "杭州",
      insuranceType: "基本险",
      wechatId: "audi_sales_003",
      wechatName: "王经理"
    },
    {
      image: testImage,
      title: "大众途观",
      titleEn: "Volkswagen Tiguan",
      guidePrice: 28.99,
      discountAmount: 1.50,
      exportMethod: "海运",
      exportPrice: 250000,
      color: "曜石黑",
      deliveryType: "现车",
      deliveryCity: "深圳",
      insuranceType: "全险",
      wechatId: "vw_sales_004",
      wechatName: "赵经理"
    },
    {
      image: testImage,
      title: "马自达 CX-5",
      titleEn: "Mazda CX-5",
      guidePrice: 22.99,
      discountAmount: 1.00,
      exportMethod: "海运",
      exportPrice: 200000,
      color: "魂动红",
      deliveryType: "现车",
      deliveryCity: "广州",
      insuranceType: "基本险",
      wechatId: "mazda_sales_005",
      wechatName: "陈经理"
    },
    {
      image: testImage,
      title: "奔驰 E级",
      titleEn: "Mercedes-Benz E-Class",
      guidePrice: 65.99,
      discountAmount: 4.00,
      exportMethod: "空运",
      exportPrice: 600000,
      color: "月光石灰",
      deliveryType: "期货",
      deliveryCity: "天津",
      insuranceType: "全险",
      wechatId: "benz_sales_006",
      wechatName: "刘经理"
    },
    {
      image: testImage,
      title: "丰田凯美瑞",
      titleEn: "Toyota Camry",
      guidePrice: 26.99,
      discountAmount: 1.20,
      exportMethod: "海运",
      exportPrice: 230000,
      color: "铂金白",
      deliveryType: "现车",
      deliveryCity: "厦门",
      insuranceType: "基本险",
      wechatId: "toyota_sales_007",
      wechatName: "黄经理"
    },
    {
      image: testImage,
      title: "本田雅阁",
      titleEn: "Honda Accord",
      guidePrice: 24.99,
      discountAmount: 1.00,
      exportMethod: "海运",
      exportPrice: 220000,
      color: "星月白",
      deliveryType: "现车",
      deliveryCity: "宁波",
      insuranceType: "全险",
      wechatId: "honda_sales_008",
      wechatName: "周经理"
    },
    {
      image: testImage,
      title: "日产天籁",
      titleEn: "Nissan Teana",
      guidePrice: 23.99,
      discountAmount: 0.80,
      exportMethod: "海运",
      exportPrice: 210000,
      color: "象牙白",
      deliveryType: "期货",
      deliveryCity: "大连",
      insuranceType: "基本险",
      wechatId: "nissan_sales_009",
      wechatName: "吴经理"
    },
    {
      image: testImage,
      title: "现代 ix35",
      titleEn: "Hyundai ix35",
      guidePrice: 19.99,
      discountAmount: 0.50,
      exportMethod: "海运",
      exportPrice: 180000,
      color: "幻影黑",
      deliveryType: "现车",
      deliveryCity: "青岛",
      insuranceType: "全险",
      wechatId: "hyundai_sales_010",
      wechatName: "郑经理"
    }
  ];
  return (
    <PageContent className={s.root}>
      <Header/>
      <DropdownSelect
        value={dropdownValue}
        onChange={setDropdownValue}
        items={items}
      />
      <div className={s.content}>
        {!dataSource?.length ? <Empty description="暂无数据"/> : dataSource.map((item) => (
          <CarCard {...item}/>
        ))}
      </div>
    </PageContent>
  )
}
