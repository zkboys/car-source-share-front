declare module '~react-pages' {
  import type {RouteObject} from 'react-router-dom';
  const routes: RouteObject[];
  export default routes;
}

declare module '~pages-config' {
  const config: {
    // 文件路径
    filePath: string;
    // 配置路由地址
    path?: string;
    // 约定路由地址
    conventionalRoutePath: string;
    // 真实路由地址
    routePath?: string;
  }[];
  import type {RouteObject} from 'react-router-dom';
  export const routes: RouteObject[];
  export const menus: any;
  export default config;
}
