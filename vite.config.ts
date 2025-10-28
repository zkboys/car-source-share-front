import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// @ts-expect-error
import eslint from 'vite-plugin-eslint';

import pagesConfig from './vite-plugin-pages-config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    pagesConfig({
      routeType: 'config', // 配置化路由
    }),
    eslint({
      failOnWarning: false,
      failOnError: false,
      include: ['src/**/*.ts', 'src/**/*.tsx'], // 你可以按需配置
    }),
  ],
  css: {
    postcss: './postcss.config.cjs', // 可选，Vite 会自动识别
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'build', // 输出目录（默认 dist）
    assetsDir: 'static', // 静态资源目录（默认 assets）
  },
  server: {
    open: true, // 自动打开浏览器
  }
})
