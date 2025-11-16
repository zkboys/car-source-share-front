import s from './index.module.less';
import weChatImg from './wechat.svg';
import {Ellipsis, Swiper} from 'antd-mobile';
import {t} from '@/i18n';
import {useFunction} from '@/hooks';
import {useNavigate} from 'react-router';
import {CarSource} from "@/types";
import {ContactDialog} from "@/components";

export type CarCardProps = {
  data: CarSource;
  onImageClick: (images: string[], index: number) => void;
};

export function CarCard(props: CarCardProps) {
  const {data, onImageClick} = props;
  const {
    id,
    carPhoto,
    title,
    guidePrice,
    // discountAmount,
    exportMethod,
    exportPrice,
    color,
    deliveryType,
    deliveryCity,
    insuranceType,
    number,
    contact,
    weChat,
  } = data || {};

  const navigate = useNavigate();

  const handleToDetail = useFunction(() => {
    navigate(`/detail?id=${id}`);
  });

  return (
    <div className={s.root}>
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
                        onImageClick?.(carPhoto, index);
                      }}
                    />
                  </Swiper.Item>
                );
              })}
            </Swiper>
          ) : (
            <div className={s.noPhoto}>{t('common.noPhoto')}</div>
          )}
        </div>
        <div className={s.titleWrap}>
          <div className={s.title} onClick={handleToDetail}>
            <Ellipsis direction="end" rows={3} content={title || ''}/>
          </div>
        </div>
      </div>
      <div className={s.priceInfo} onClick={handleToDetail}>
        {[
          {label: t('common.guidancePrice'), value: guidePrice},
          // {label: t('common.discountAmount'), value: discountAmount},
          {label: t('common.exportMethod'), value: exportMethod},
          {label: t('common.exportPrice'), value: exportPrice},
        ].map((item) => {
          const {label, value} = item;
          return (
            <div key={label} className={s.priceItem}>
              <span className={s.label}>{label}</span>
              <span className={s.value}>{value}</span>
            </div>
          );
        })}
      </div>
      <div className={s.details} onClick={handleToDetail}>
        {[color, deliveryType, deliveryCity, insuranceType].map(
          (item, index) => {
            return (
              <div key={index} className={s.detailItem}>
                <span>
                  <Ellipsis direction="end" rows={1} content={item || ''}/>
                </span>
              </div>
            );
          },
        )}
      </div>
      <ContactDialog
        contact={contact}
        number={number}
        weChat={weChat}
      >
        <img className={s.weChatIcon} src={weChatImg} alt={t('common.weChat')}/>
        <span className={s.contactText}>{t('common.addWeChat')}</span>
      </ContactDialog>
    </div>
  );
}
