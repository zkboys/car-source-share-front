import {PageContent} from '@/components';
import {config} from '@/config-hoc';
import {useFunction} from '@/hooks';
import {LocalePicker, t} from '@/i18n';
import {CarSource} from '@/pages/home/components';
import {ImageViewer, NavBar, Swiper} from 'antd-mobile';
import {useEffect, useRef, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router';
import s from './index.module.less';
import {getDataByLanguage} from "@/commons";
import {ajax} from "@/commons/ajax";


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
    <PageContent>
      <NavBar
        className={s.nav}
        onBack={() => navigate(-1)}
        right={<LocalePicker/>}
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
