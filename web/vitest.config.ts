import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// 独立的 vitest 配置：不复用 vite.config.ts 的 MPA / auto-import 插件，
// 仅保留单测所需的 vue 编译与路径别名，环境用 jsdom。
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@management': fileURLToPath(new URL('./src/management', import.meta.url)),
      '@materials': fileURLToPath(new URL('./src/materials', import.meta.url)),
      '@render': fileURLToPath(new URL('./src/render', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}']
  }
})
