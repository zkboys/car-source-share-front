import s from "./index.module.less";
import wechatImg from './wechat.svg';
import {Dialog, Ellipsis} from "antd-mobile";

export type CarSource = {
  id: string | number;
  /** 图片 */
  carPhoto: string;
  /** 品牌 */
  brand: string;
  /** 名称 */
  title: string;
  /** 英文名称 */
  titleEn: string;
  /** 指导价 */
  guidePrice: string;
  /** 优惠金额 */
  discountAmount: number;
  /** 出口方式 */
  exportMethod: string;
  /** 出口价 */
  exportPrice: string;
  /** 颜色 */
  color: string;
  /** 提车类型 比如 现车 */
  deliveryType: string;
  /** 可提车城市 */
  deliveryCity: string;
  /** 保险类型 */
  insuranceType: string;
  /** 微信二维码图片 */
  weChat: string;
  /** 联系人姓名 */
  contact: string;
  /** 联系人手机号 */
  number: string;
  /** 创建时间 */
  createTime: string;
};

export function CarCard(props: CarSource) {
  const {
    carPhoto,
    title,
    guidePrice,
    discountAmount,
    exportMethod,
    exportPrice,
    color,
    deliveryType,
    deliveryCity,
    insuranceType,
    number,
    contact,
    weChat,
  } = props;

  return (
    <div className={s.root}>
      <div className={s.top}>
        <img src={carPhoto} alt={title} className={s.image}/>
        <div className={s.titleWrap}>
          <div className={s.title}>
            <Ellipsis direction="end" rows={2} content={title || ''}/>
          </div>
        </div>
      </div>
      <div className={s.priceInfo}>
        <div className={s.priceItem}>
          <span className={s.label}>指导价</span>
          <span className={s.value}>{guidePrice}</span>
        </div>
        <div className={s.priceItem}>
          <span className={s.label}>优惠金额</span>
          <span className={s.value}>{discountAmount}</span>
        </div>
        <div className={s.priceItem}>
          <span className={s.label}>出口方式</span>
          <span className={s.value}>{exportMethod}</span>
        </div>
        <div className={s.priceItem}>
          <span className={s.label}>出口价</span>
          <span className={s.value}>{exportPrice}</span>
        </div>
      </div>
      <div className={s.details}>
        <span className={s.detailItem}>{color}</span>
        <span className={s.detailItem}>{deliveryType}</span>
        <span className={s.detailItem}>{deliveryCity}</span>
        <span className={s.detailItem}>{insuranceType}</span>
      </div>
      <div
        className={s.contactWrap}
        onClick={() =>
          Dialog.alert({
            content: (
              <div className={s.contactInfo}>
                <div>{contact}：<a className={s.number} href={`tel:${number}`}>{number}</a></div>
                <div className={s.weChat}>
                  <img src={weChat} alt="微信二维码"/>
                </div>
              </div>
            ),
          })
        }
      >
        <img className={s.wechatIcon} src={wechatImg} alt="微信"/>
        <span className={s.contactText}>加微信</span>
      </div>
    </div>
  );
}
