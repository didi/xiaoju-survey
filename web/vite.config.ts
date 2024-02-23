import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import type { ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createMpaPlugin, createPages } from 'vite-plugin-virtual-mpa'



const pages = createPages([
  {
    name: 'management',
    filename: 'src/management/index.html', // 输出目录
    template: 'src/management/index.html',
    entry: '/src/management/main.ts'
  },
  {
    name: 'render',
    filename: 'src/render/index.html',
    template: 'src/render/index.html',
    entry: '/src/render/main.js'
  }
])

// https://vitejs.dev/config/
export default defineConfig({
  appType: "mpa",
  plugins: [
    // pathRewritePlugin(),
    vue(),
    vueJsx(),
    createMpaPlugin({
      pages
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css : {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/management/styles/variable.scss";`,
      }
    }
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        management: resolve(__dirname, 'public/management.html'),
        render: resolve(__dirname, 'public/render.html'),
      },
    },
  }
})
