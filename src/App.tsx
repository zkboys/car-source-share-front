import { Suspense } from 'react'
import { Layout, GlobalLoading } from '@/components';
import AppRouter from './AppRouter.tsx';

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<GlobalLoading />}>
        <AppRouter />
      </Suspense>
    </Layout>
  )
}
