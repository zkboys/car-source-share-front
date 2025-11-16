import { getDataByLanguage } from '@/commons';
import { ajax } from '@/commons/ajax';
import { ContactDialog, PageContent } from '@/components';
import { config } from '@/config-hoc';
import { useFunction } from '@/hooks';
import { language, LocalePicker, t } from '@/i18n';
import { CarSource } from '@/types';
import {
  Button,
  ImageViewer,
  NavBar,
  SafeArea,
  Space,
  Swiper,
} from 'antd-mobile';
import c from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import s from './index.module.less';

export default config<DetailProps>({
  title: t('common.detail.title'),
  path: '/detail',
})(Detail);

type DetailProps = {
  title: string;
};

function Detail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const [data, setData] = useState<CarSource>();
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const imageViewerRef = useRef<any>(null);
  const [viewerImages, setViewerImages] = useState<string[]>([]);

  const handleImageClick = useFunction((images, index) => {
    setViewerImages(images);
    imageViewerRef.current.swipeTo(index);
    setViewerVisible(true);
  });

  useEffect(() => {
    (async () => {
      const res = await ajax.get(`/car/source/detail?id=${id}`);
      const data = res.data;
      if (data) {
        setData(getDataByLanguage(data));
      }
    })();
  }, [id]);

  const carPhoto = data?.carPhoto;

  return (
    <PageContent className={c(s.root, s[language])}>
      <NavBar
        className={s.nav}
        onBack={() => navigate(-1)}
        right={<LocalePicker />}
      >
        {t('common.detail.title')}
      </NavBar>
      {data ? (
        <div className={s.contentWrapper}>
          <div className={s.images}>
            {carPhoto?.length ? (
              <Swiper
                indicator={(total, current) => (
                  <div className={s.indicator}>
                    {current + 1} / {total}
                  </div>
                )}
              >
                {carPhoto?.map((url: string, index: number) => {
                  return (
                    <Swiper.Item key={url}>
                      <img
                        src={url}
                        alt={data?.title}
                        className={s.image}
                        onClick={() => {
                          handleImageClick(carPhoto, index);
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
          <div className={s.content}>
            <div className={s.title}>{data?.title}</div>
            <div className={s.item}>
              <div className={s.label}>{t('common.deliveryTypeLabel')}</div>
              <div className={s.value}>{data?.deliveryType ?? '-'}</div>
            </div>
            <div className={s.item}>
              <div className={s.label}>{t('common.colorLabel')}</div>
              <div className={s.value}>{data?.color ?? '-'}</div>
            </div>
            <div className={s.item}>
              <div className={s.label}>{t('common.guidePriceLabel')}</div>
              <div className={s.value}>{data?.guidePrice ?? '-'}</div>
            </div>
            <div className={s.item}>
              <div className={s.label}>{t('common.exportPriceLabel')}</div>
              <div className={s.value}>{data?.exportPrice ?? '-'}</div>
            </div>
            <div className={s.item}>
              <div className={s.label}>{t('common.exportMethodLabel')}</div>
              <div className={s.value}>{data?.exportMethod ?? '-'}</div>
            </div>
          </div>
          <div className={s.content}>
            <div className={s.contentTitle}>{t('common.carInfo')}</div>
            <div className={s.item}>
              <div className={s.label}>{t('common.VINLabel')}</div>
              <div className={s.value}>
                {data?.VIN?.replace(
                  /^(.{9})(?:.*)(.{2})$/,
                  (_, a, b) => a + '*'.repeat(Math.max(0, 17 - 9 - 2)) + b,
                ) ?? '-'}
              </div>
            </div>
            <div className={s.item}>
              <div className={s.label}>{t('common.deliveryCityLabel')}</div>
              <div className={s.value}>{data?.deliveryCity ?? '-'}</div>
            </div>
            <div className={s.item}>
              <div className={s.label}>{t('common.insuranceTypeLabel')}</div>
              <div className={s.value}>{data?.insuranceType ?? '-'}</div>
            </div>
          </div>
          <div className={s.content}>
            <div className={s.contentTitle}>{t('common.configFeature')}</div>
            <div className={s.feature}>
              <pre>
                {data?.vehicleConfiguration ?? '-'}
              </pre>
            </div>
          </div>
        </div>
      ) : null}
      <div className={s.footer}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <ContactDialog className={s.contact} weChat={data?.WeChatQRcode}>
            <Button block>
              <div className={s.follow}>
                <span>{t('common.followForFurther')}</span>
                <a>{t('common.follow')}</a>
              </div>
            </Button>
          </ContactDialog>

          <ContactDialog
            className={s.contact}
            contact={data?.contact}
            number={data?.number}
            weChat={data?.weChat}
          >
            <Button color="primary" block>
              {t('common.contactSupplier')}
            </Button>
          </ContactDialog>
        </Space>
        <SafeArea position="bottom" />
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
