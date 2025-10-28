import {ModuleNode, type Plugin, type ViteDevServer} from 'vite';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import fs from 'fs/promises';
import fg from 'fast-glob';
import micromatch from 'micromatch'
import path from 'path';
import {slash} from '@antfu/utils'
import colors from 'picocolors';

type UserOptions = {
  /**
   * 路由类型：
   * - 'config'：配置式路由，依赖用户提供完整路由配置
   * - 'convention'：约定式路由，自动扫描页面目录生成路由
   * @default 'convention'
   */
  routeType?: 'config' | 'convention';

  /**
   * 页面文件的匹配模式，支持 glob 语法
   * 用于扫描路由页面文件。
   * @default 'src/pages/**\/*.{tsx,jsx}'
   */
  targetFiles?: string;

  /**
   * 页面根目录，所有页面都应位于此目录下
   * 通常用于构建约定式路由。
   * @default 'src/pages'
   */
  pagesDir?: string;

  /**
   * 忽略扫描的子目录名，常用于排除组件、工具类文件夹等
   * 仅影响约定式路由的扫描结果。
   * @default ['component', 'components', 'util', 'utils']
   */
  ignoreDirs?: string[];

  /**
   * 是否启用 Nuxt 风格的动态路由参数（例如 [id] → :id）
   * 仅在约定式路由中生效。
   * @default true
   */
  useNuxtStyle?: boolean;

  /**
   * 虚拟模块的模块 ID，用于插件内部注入内容
   * 应以 '\0' 前缀作为虚拟模块标识。
   * @default '\0virtual:pages-config'
   */
  virtualId?: string;

  /**
   * 虚拟模块的包名，用于 import 引用
   * @default '~pages-config'
   */
  virtualPackageName?: string;
};
type PageConfig = {
  /**
   * 配置式路由路径（仅在 routeType 为 'config' 时使用）
   */
  path?: string;

  /**
   * 页面源文件路径（绝对路径）
   */
  filePath: string;

  /**
   * 根据文件名自动生成的约定式路由路径（如 /user/[id] -> /user/:id）
   */
  conventionalRoutePath: string;

  /**
   * 自动生成的菜单唯一 key，一般与 conventionalRoutePath 相同
   */
  conventionalMenuKey: string;

  /**
   * 实际用于注册到路由系统中的路由路径，根据routeType确定为 path 或 conventionalRoutePath
   */
  routePath: string;

  /**
   * 扫描页面文件时提取到的额外信息，如页面标题、meta 等
   */
  [key: string]: any;
};

export default function pageConfigPlugin(userOptions?: UserOptions): Plugin {
  let ctx: PluginContext;

  return {
    name: 'vite-plugin-pages-config',
    enforce: 'pre',
    // 获取配置
    configResolved(config) {
      ctx = new PluginContext(userOptions, config.root);
    },
    // 开始构建 处理所有文件
    async buildStart() {
      await ctx.rebuildAllFiles();
    },

    // 自定义模块路径解析
    resolveId(id) {
      if (id === ctx.options.virtualPackageName) {
        return ctx.options.virtualId;
      }
    },

    // 加载模块内容（可自定义虚拟模块等）
    load(id) {
      if (id === ctx.options.virtualId) {
        return ctx.genCode();
      }
    },
    // 配置开发服务器，如注册中间件	dev 模式有效
    configureServer(server) {
      ctx.setupViteServer(server);
    },
  };
}

class PluginContext {
  // 项目根目录
  root: string;
  // 收集到的配置对象
  configEntries: Map<string, any>;
  // 用户配置参数
  options: UserOptions;

  constructor(userOptions: UserOptions = {}, viteRoot: string = process.cwd()) {
    this.root = slash(viteRoot);
    this.configEntries = new Map();

    // 处理默认值
    const {
      routeType = 'convention',
      targetFiles = 'src/pages/**/*.{tsx,jsx}',
      pagesDir = 'src/pages',
      useNuxtStyle = true,
      virtualId = '\0virtual:pages-config',
      virtualPackageName = '~pages-config',
      ignoreDirs = [
        'component',
        'components',
        'util',
        'utils',
      ],
    } = userOptions;

    this.options = {
      routeType,
      targetFiles,
      pagesDir,
      useNuxtStyle,
      virtualId,
      virtualPackageName,
      ignoreDirs
    }
  }

  /**
   * 判断文件是否是需要处理的文件
   * @param filePath - 文件地址
   */
  isTarget(filePath: string) {
    if (this.options.ignoreDirs!.some(item => filePath?.includes(`/${item}/`))) {
      return false;
    }

    const pattern = slash(path.join(this.root, this.options.targetFiles!));
    return micromatch.isMatch(filePath, pattern);
  }

  /**
   * 分析文件，提取config配置
   * @param filePath - 文件地址
   */
  async analyzeFile(filePath: string) {
    const code = await fs.readFile(filePath, 'utf-8');
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    let foundConfig: PageConfig = {} as PageConfig;

    // @ts-ignore
    traverse.default(ast, {
      // @ts-ignore
      ExportDefaultDeclaration: (pathNode) => {
        const decl = pathNode.node.declaration;
        if (
          decl.type === 'CallExpression' &&
          decl.callee.type === 'CallExpression' &&
          decl.callee.callee.type === 'Identifier' &&
          decl.callee.callee.name === 'config'
        ) {
          const configArg = decl.callee.arguments[0];
          if (configArg?.type === 'ObjectExpression') {
            const config: Record<string, any> = {};

            for (const prop of configArg.properties) {
              if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier') {
                const key = prop.key.name;
                const val = prop.value;

                if (val.type === 'StringLiteral') config[key] = val.value;
                else if (val.type === 'NumericLiteral') config[key] = val.value;
                else if (val.type === 'BooleanLiteral') config[key] = val.value;
                // 其他类型忽略，以 [complex] 占位
                else config[key] = '[complex]';
              }
            }

            // 抓取到的页面config参数
            foundConfig = {
              ...config,
              filePath,
              conventionalRoutePath: '',
              conventionalMenuKey: '',
              routePath: '',
            };
          }
        }
      },
    });

    // 约定路由 path 获取
    const conventionalRoutePath = getConventionalRoutePath(filePath, {
      root: this.root,
      pagesDir: this.options.pagesDir!,
      useNuxtStyle: this.options.useNuxtStyle,
    });

    // 目标文件配置，无论页面中是否有使用config高阶组件
    return {
      ...(foundConfig || {}),
      filePath,
      conventionalRoutePath,
      conventionalMenuKey: conventionalRoutePath,
      routePath: this.options.routeType === 'convention' ? conventionalRoutePath : foundConfig?.path,
    }
  }

  /**
   * 处理所有文件
   */
  async rebuildAllFiles() {
    const files = await fg(this.options.targetFiles!, {
      cwd: this.root,
      absolute: true,
    });
    this.configEntries.clear();
    // 保存配置路由path，用于查重
    const pathSet = new Set<string>();

    for (const file of files) {
      if (!this.isTarget(file)) continue;

      const cfg = await this.analyzeFile(file);

      if (!cfg) continue;

      // 配置路由不允许重复
      if (cfg.path) {
        if (pathSet.has(cfg.path)) {
          const message = `❌  [vite-plugin-pages-config] Duplicate path: "${cfg.path}", \n   file: ${file}`;

          if (process.env.VITE_RUN_ENV === 'development') {
            console.warn(colors.red(message));
            continue;
          } else {
            throw new Error(message);
          }
        }

        pathSet.add(cfg.path);
      }

      this.configEntries.set(file, cfg);
    }
  }

  /**
   * 设置开发服务器，用于监听文件变动
   * @param server - ViteDevServer 实例
   */
  setupViteServer(server: ViteDevServer) {
    const watcher = server.watcher;

    watcher
      .on('unlink', async (path: string) => {
        path = slash(path);

        if (!this.isTarget(path)) return;

        await this.rebuildAllFiles();
        this.invalidatePagesModule(server);
      });

    watcher
      .on('add', async (path) => {
        path = slash(path);

        if (!this.isTarget(path)) return;

        await this.rebuildAllFiles();
        this.invalidatePagesModule(server);
      })

    watcher
      .on('change', async (path) => {
        path = slash(path);

        if (!this.isTarget(path)) return;

        const existConfig = this.configEntries.get(path);
        const newConfig = await this.analyzeFile(path);

        // 更新前后配置一致或者都不存在，不做任何动作
        if (JSON.stringify(existConfig) === JSON.stringify(newConfig)) return;

        await this.rebuildAllFiles();
        this.invalidatePagesModule(server);

        // // 触发页面刷新
        // server.ws.send({
        //   type: 'full-reload',
        // })
      })
  }

  /**
   * 通知 Vite 开发服务器使虚拟模块失效并触发浏览器热更新（HMR）。
   * 适用于手动更新某个虚拟模块后，强制刷新页面或让依赖此模块的模块重新加载。
   *
   * @param server - ViteDevServer 实例
   */
  invalidatePagesModule(server: ViteDevServer) {
    const {moduleGraph} = server;

    // 从模块图中获取虚拟模块对应的 ModuleNode 列表（可能有多个引用）
    const mods = moduleGraph.getModulesByFile(this.options.virtualId!);
    if (!mods) return;

    // 用于防止重复失效模块，避免递归中出现死循环
    const seen = new Set<ModuleNode>();
    for (const mod of mods) {
      // 使模块无效，触发重新加载，通常会连锁影响依赖它的模块
      moduleGraph.invalidateModule(mod, seen);
    }

    // 发送 websocket 消息给前端客户端，触发 HMR 更新流程
    server.ws.send({
      type: 'update', // 通知类型为模块更新
      updates: Array.from(mods).map(mod => ({
        type: 'js-update',        // 表示 JavaScript 模块更新
        path: mod.url,            // 模块路径（用于确定热更新的模块）
        acceptedPath: mod.url,    // 被接受更新的路径（通常与 path 相同）
        timestamp: Date.now(),    // 当前时间戳，用于缓存 busting
      }))
    });
  }

  // 生成虚拟文件代码
  genCode() {
    const pageConfigs = Array.from(this.configEntries.values());

    return `
    import React, { lazy } from 'react';

    // 约定菜单数据
    export const menus = ${JSON.stringify(generateMenus(pageConfigs), null, 2)};

    // 约定路由组件定义
    ${pageConfigs.map(item => {
      const {routePath, filePath} = item;
      if (!routePath) return '';

      const componentName = pathToComponentName(routePath);
      return `const ${componentName} = lazy(() => import('${filePath}'));`;
    }).join('\n')};

    // 约定路由数据
    export const routes = [
    ${pageConfigs.map(item => {
      const {routePath} = item;
      if (!routePath) return '';

      const componentName = pathToComponentName(routePath);
      return `
        {
          caseSensitive: false,
          path: '${routePath}',
          element: React.createElement(${componentName}),
        },`
    }).join('\n')}
    ];

    // 默认导出所有抓取到的页面配置
    export default ${JSON.stringify(pageConfigs, null, 2)};
    `;
  }
}

/**
 * 约定路由生成
 * @param filePath - 文件路径
 * @param options - 参数配置，路径、风格等
 */
function getConventionalRoutePath(filePath: string, options: {
  root: string;
  pagesDir: string; // 相对 root 的目录，比如 'src/pages'
  useNuxtStyle?: boolean; // 是否采用 Nuxt 风格的路由参数，如 [id]
}): string {
  const {root, pagesDir, useNuxtStyle = true} = options;

  // 获取 pages 目录绝对路径
  const absPagesDir = path.resolve(root, pagesDir);
  const absFilePath = path.resolve(filePath);

  // 确保 filePath 是在 pagesDir 之下
  if (!absFilePath.startsWith(absPagesDir)) {
    throw new Error(`File ${filePath} is not under pagesDir ${pagesDir}`);
  }

  // 获取 pages 内部的相对路径，比如 'home/index.tsx'
  let relativePath = path.relative(absPagesDir, absFilePath);
  relativePath = relativePath.replace(/\\/g, '/'); // 统一分隔符

  // 去掉文件扩展名
  relativePath = relativePath.replace(/\.(jsx?|tsx?)$/, '');

  const segments = relativePath.split('/');
  const routeParts: string[] = [];

  segments.forEach((seg, index) => {
    const isLast = index === segments.length - 1;
    const isIndex = seg.toLowerCase() === 'index';

    if (isIndex && isLast) {
      // 忽略末尾 index
      return;
    }

    // 动态路由：[id] => :id
    if (useNuxtStyle && /^\[.+]$/.test(seg)) {
      const name = seg.slice(1, -1);
      if (name.startsWith('...')) {
        routeParts.push(`*`);
      } else {
        routeParts.push(`:${name}`);
      }
    } else {
      routeParts.push(seg);
    }
  });

  return '/' + routeParts.join('/');
}

/**
 * 将路由路径转为 PascalCase 组件名称
 * @example
 *   "/" => "Index__"
 *   "/home" => "Home"
 *   "/home/user" => "HomeUser"
 *   "/home/:id" => "HomeId"
 *   "/user-center" => "UserCenter"
 *   "/user_center" => "UserCenter"
 *   "/home/:user-id" => "HomeUserId"
 */
function pathToComponentName(path: string): string {
  return path
    .split('/')                        // 以 / 分割路径
    .filter(Boolean)                  // 去除空项
    .map((part) => {
      // 去掉参数前缀 ":"
      const clean = part.startsWith(':') ? part.slice(1) : part;
      // 再按 非字母数字 划分（如 '-', '_', ':', 等），并转换成 PascalCase
      return clean
        .split(/[^a-zA-Z0-9]+/)       // 用非字母数字字符切分
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    })
    .join('') || 'Index__';
}


type MenuItem = {
  key: string;
  parentKey: string | null;
  title: string;
  label: string;
  path?: string;
  children?: MenuItem[];
  order: number;
  parentTitle?: string;
  parentOrder?: number;
};

/**
 * 基于文件层级，生成菜单
 * @param pageConfigs - 页面配置
 */
function generateMenus(pageConfigs: PageConfig[]): MenuItem[] {
  // 先过滤出有 title 的页面作为菜单候选
  const pagesWithTitle = pageConfigs.filter(item => item.title);

  // 扁平菜单集合
  const flatMenus: MenuItem[] = [];

  pagesWithTitle.forEach(item => {
    // 约定路由作为key
    const key = item.conventionalMenuKey;

    if (!key) return;

    // 父级路径是去掉最后一段
    const segments = key.split('/').filter(Boolean);
    const parentSegments = segments.slice(0, -1);
    const parentKey = parentSegments.length ? '/' + parentSegments.join('/') : null;

    flatMenus.push({
      key,
      parentKey,
      title: item.title || key,
      label: item.title || key,
      path: item.routePath,
      order: item.order || 0,
      parentTitle: item.parentTitle,
      parentOrder: item.parentOrder,
    });
  });

  // 添加缺失的父菜单（如果父菜单不在 flatMenus 中）
  flatMenus.forEach(menu => {
    if (menu.parentKey && !flatMenus.find(m => m.key === menu.parentKey)) {
      flatMenus.push({
        key: menu.parentKey,
        parentKey: (() => {
          const pSeg = menu.parentKey!.split('/').filter(Boolean);
          const ppSeg = pSeg.slice(0, -1);
          return ppSeg.length ? '/' + ppSeg.join('/') : null;
        })(),
        title: menu.parentTitle || menu.parentKey,
        label: menu.parentTitle || menu.parentKey,
        order: menu.parentOrder || 0,
      });
    }
  });

  // 转成树形结构
  const idMap = new Map<string, MenuItem>();
  flatMenus.forEach(menu => idMap.set(menu.key, menu));

  const tree: MenuItem[] = [];

  flatMenus.forEach(menu => {
    if (menu.parentKey && idMap.has(menu.parentKey)) {
      const parent = idMap.get(menu.parentKey)!;
      parent.children = parent.children || [];
      parent.children.push(menu);
    } else {
      tree.push(menu);
    }
  });

  // 按 order 排序、清理属性
  function dealMenus(menus: MenuItem[]) {
    menus.sort((a, b) => b.order - a.order);
    menus.forEach(m => {
      if (m.children) {
        dealMenus(m.children)
      }

      // 清理无用属性
      Reflect.deleteProperty(m, 'order');
      Reflect.deleteProperty(m, 'parentKey');
      Reflect.deleteProperty(m, 'parentTitle');
    });
  }

  dealMenus(tree);

  return tree;
}
