import s from "./index.module.less";
import wechatImg from './wechat.svg';
import { Dialog, Ellipsis } from "antd-mobile";

export type CarCardProps = {
  id: string | number;
  /** 图片 */
  image: string;
  /** 名称 */
  title: string;
  /** 英文名称 */
  titleEn: string;
  /** 指导价 */
  guidePrice: number;
  /** 优惠金额 */
  discountAmount: number;
  /** 出口方式 */
  exportMethod: string;
  /** 出口价 */
  exportPrice: number;
  /** 颜色 */
  color: string;
  /** 提车类型 比如 现车 */
  deliveryType: string;
  /** 可提车城市 */
  deliveryCity: string;
  /** 保险类型 */
  insuranceType: string;
  /** 微信号 */
  wechatId: string;
  /** 微信名称 */
  wechatName: string;
};

export function CarCard(props: CarCardProps) {
  const {
    image,
    title,
    titleEn,
    guidePrice,
    discountAmount,
    exportMethod,
    exportPrice,
    color,
    deliveryType,
    deliveryCity,
    insuranceType,
    wechatId,
    wechatName,
  } = props;

  return (
    <div className={s.root}>
      <div className={s.top}>
        <img src={image} alt={title} className={s.image} />
        <div className={s.titleWrap}>
          <div className={s.title}>
            <Ellipsis direction="end" rows={2} content={title} />
          </div>
        </div>
      </div>
      <div className={s.priceInfo}>
        <div className={s.priceItem}>
          <span className={s.label}>指导价</span>
          <span className={s.value}>{guidePrice}万</span>
        </div>
        <div className={s.priceItem}>
          <span className={s.label}>优惠金额</span>
          <span className={s.value}>{discountAmount}万</span>
        </div>
        <div className={s.priceItem}>
          <span className={s.label}>出口方式</span>
          <span className={s.value}>{exportMethod}</span>
        </div>
        <div className={s.priceItem}>
          <span className={s.label}>出口价</span>
          <span className={s.value}>${exportPrice}.00</span>
        </div>
      </div>
      <div className={s.details}>
        <span className={s.detailItem}>{color}</span>
        <span className={s.detailItem}>{deliveryType}</span>
        <span className={s.detailItem}>{deliveryCity}</span>
        <span className={s.detailItem}>{insuranceType}</span>
      </div>
      <div
        className={s.contact}
        onClick={() =>
          Dialog.alert({
            content: (
              <div className={s.wechat}>
                <div className={s.wechatName}>{wechatName}</div>
                <div>微信：<a className={s.wechatId} href={`tel:${wechatId}`}>{wechatId}</a></div>
              </div>
            ),
          })
        }
      >
        <img className={s.wechatIcon} src={wechatImg} alt="微信" />
        <span className={s.contactText}>加微信</span>
      </div>
    </div>
  );
}
