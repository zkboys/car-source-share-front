import { Suspense, useEffect } from 'react'
import { Layout, GlobalLoading } from '@/components';
import AppRouter from './AppRouter.tsx';

export default function App() {
  useEffect(() => {
    console.log('App 加载');
    return () => {
      console.log('App 卸载');
    }
  }, []);
  return (
    <Layout>
      <Suspense fallback={<GlobalLoading />}>
        <AppRouter />
      </Suspense>
    </Layout>
  )
}
