import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter,} from 'react-router-dom'
import {HelmetProvider} from 'react-helmet-async';
import {LocaleProvider} from '@/i18n';

import App from './App'
import './main.less';
import {CONFIG} from "@/config";

const app = createRoot(document.getElementById('root')!)

app.render(
  /* 在 React 18 中，开发模式 + 严格模式下，React 会故意调用两次组件的挂载和卸载，以检查副作用是否安全 */
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={CONFIG.companyId}>
        <LocaleProvider>
          <App/>
        </LocaleProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
