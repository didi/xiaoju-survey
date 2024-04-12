import { fileURLToPath, URL } from 'node:url'
import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createMpaPlugin, createPages } from 'vite-plugin-virtual-mpa'
import ElementPlus from 'unplugin-element-plus/vite'

const isProd = process.env.NODE_ENV === 'production'

const pages = createPages([
  {
    name: 'management',
    filename: isProd ? 'management.html' : 'src/management/index.html',
    template: 'src/management/index.html',
    entry: '/src/management/main.ts'
  },
  {
    name: 'render',
    filename: isProd ? 'render.html' : 'src/render/index.html',
    template: 'src/render/index.html',
    entry: '/src/render/main.js'
  }
])
const mpaPlugin = createMpaPlugin({
  pages,
  verbose: true,
  rewrites: [
    {
      from: /render/,
      to: (ctx) =>  normalizePath('/src/render/index.html')
    },
    {
      from: /\/|\/management\/.?/,
      to: (ctx) => normalizePath('/src/management/index.html')
    },
  ]
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    ElementPlus({
      useSource: true
    }),
    mpaPlugin
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/management/styles/variable.scss" as *;`
      }
    }
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {}
  }
})
