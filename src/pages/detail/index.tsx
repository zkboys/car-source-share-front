import { PageContent } from '@/components';
import { config } from '@/config-hoc';
import { useFunction } from '@/hooks';
import { language, LocalePicker, t } from '@/i18n';
import { CarSource } from '@/pages/home/components';
import { NavBar, Swiper } from 'antd-mobile';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import s from './index.module.less';

function getValueByLanguage(data: CarSource, field: string) {
  const isEn = language === 'en-US';
  const _field = isEn ? `${field}En` : field;
  // @ts-ignore
  return data[_field] || data[field] || '';
}

export default config<DetailProps>({
  title: t('detail.title'),
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

  const handleImageClick = useFunction((carPhoto, index) => {
    console.log(carPhoto, index);
  });

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/car/source/detail?id=${id}`);
      const data = res.data.data;
      if (data) {
        // 基于语言，设置数据
        Object.keys(data).forEach((key) => {
          if (key.endsWith('En')) return;
          data[key] = getValueByLanguage(data, key);
        });
        const { carPhoto } = data;

        if (typeof carPhoto === 'string') {
          data.carPhoto = carPhoto.split(' ');
        }
        setData(res.data.data);
      }
    })();
  }, [id]);

  const carPhoto = data?.carPhoto;

  return (
    <PageContent>
      <NavBar
        className={s.nav}
        onBack={() => navigate(-1)}
        right={<LocalePicker />}
      >
        {t('detail.title')}
      </NavBar>
      {data ? (
        <div>
          <div className={s.images}>
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
              <div className={s.noPhoto}>{t('home.noPhoto')}</div>
            )}
          </div>
        </div>
      ) : null}
    </PageContent>
  );
}
