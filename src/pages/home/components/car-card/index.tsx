import s from "./index.module.less";
import weChatImg from './wechat.svg';
import { Dialog, Ellipsis, Swiper, ImageViewer } from "antd-mobile";
import { useRef, useState } from "react";
import {t} from "@/i18n";

export type CarSource = {
  id: string | number;
  /** 图片 */
  carPhoto?: string[];
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
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const imageViewerRef = useRef<any>(null);

  return (
    <div className={s.root}>
      <ImageViewer.Multi
        ref={imageViewerRef}
        images={carPhoto}
        visible={visible}
        defaultIndex={index}
        onIndexChange={index => setIndex(index)}
        renderFooter={(_image: string, index: number) => {
          return (
            <div
              className={s.imageViewerFooter}
            >
              {index + 1} / {carPhoto?.length}
            </div>
          )
        }}
        onClose={() => {
          setVisible(false)
        }}
      />
      <div className={s.top}>
        <div className={s.imageWrap}>
          {carPhoto?.length ? (
            <Swiper
              indicator={(total, current) => (
                <div className={s.indicator}>
                  {current + 1} / {total}
                </div>
              )}
            >
              {carPhoto?.map((url, index) => {
                return (
                  <Swiper.Item key={url}>
                    <img
                      src={url}
                      alt={title}
                      className={s.image}
                      onClick={() => {
                        imageViewerRef.current.swipeTo(index);
                        setVisible(true);
                      }}
                    />
                  </Swiper.Item>
                );
              })}
            </Swiper>
          ) : <div className={s.noPhoto}>{t('home.noPhoto')}</div>}
        </div>
        <div className={s.titleWrap}>
          <div className={s.title}>
            <Ellipsis direction="end" rows={3} content={title || ''} />
          </div>
        </div>
      </div>
      <div className={s.priceInfo}>
        <div className={s.priceItem}>
          <span className={s.label}>{t('home.guidancePrice')}</span>
          <span className={s.value}>{guidePrice}</span>
        </div>
        <div className={s.priceItem}>
          <span className={s.label}>{t('home.discountAmount')}</span>
          <span className={s.value}>{discountAmount}</span>
        </div>
        <div className={s.priceItem}>
          <span className={s.label}>{t('home.exportMethod')}</span>
          <span className={s.value}>{exportMethod}</span>
        </div>
        <div className={s.priceItem}>
          <span className={s.label}>{t('home.exportPrice')}</span>
          <span className={s.value}>{exportPrice}</span>
        </div>
      </div>
      <div className={s.details}>
        <span className={s.detailItem}>
          <span>{color}</span>
        </span>
        <span className={s.detailItem}>
          <span>{deliveryType}</span>
        </span>
        <span className={s.detailItem}>
          <span>{deliveryCity}</span>
        </span>
        <span className={s.detailItem}>
          <span>{insuranceType}</span>
        </span>
      </div>
      <div
        className={s.contactWrap}
        onClick={() =>
          Dialog.alert({
            className: s.weChatDialog,
            content: (
              <div className={s.contactInfo}>
                <div>{contact}：<a className={s.number} href={`tel:${number}`}>{number}</a></div>
                <div className={s.weChat}>
                  <img src={weChat} alt={t('home.weChatQrCode')} />
                </div>
              </div>
            ),
          })
        }
      >
        <img className={s.weChatIcon} src={weChatImg} alt={t('home.weChat')} />
        <span className={s.contactText}>{t('home.addWeChat')}</span>
      </div>
    </div>
  );
}
