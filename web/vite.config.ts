import { fileURLToPath, URL } from 'node:url'
import { defineConfig, normalizePath, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { createMpaPlugin, createPages } from 'vite-plugin-virtual-mpa'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const isProd = process.env.NODE_ENV === 'production'

function joinPath(...args: (string | boolean | undefined | null)[]): string {
  let withLeadingSlash = true

  // 判断最后一个参数是否为布尔值（控制是否带前导 /）
  const last = args[args.length - 1]
  if (typeof last === 'boolean') {
    withLeadingSlash = last
    args.pop()
  }

  const paths = args.filter((p): p is string => typeof p === 'string')

  const joined = paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/+$/, '') // 第一个去尾部 /
      } else {
        return path.replace(/^\/+|\/+$/g, '') // 中间项去掉头尾 /
      }
    })
    .filter(Boolean)
    .join('/')

  return withLeadingSlash ? (joined.startsWith('/') ? joined : '/' + joined) : joined
}

const createRedirectPlugin = (baseUrl: string): Plugin => ({
  apply: 'serve',
  // 改为前置中间件（移除return的包装）
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (baseUrl === '/') {
        if (req.url === '/' || req.url === '/index.html' || req.url === '/survey') {
          res.writeHead(301, {
            'Cache-Control': 'no-store',
            Location: '/management/'
          })
          return res.end()
        }
      } else {
        // 精确匹配根路径且无查询参数
        if (req.url === '/' || req.url === '/index.html' || req.url === '/survey') {
          res.writeHead(301, {
            'Cache-Control': 'no-store',
            Location: baseUrl + '/'
          })
          return res.end()
        }
      }
      next()
    })
  },
  name: 'vite-root-redirect'
})

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  const { VITE_BASE } = loadEnv(mode, root)
  console.log('VITE_BASE', VITE_BASE)

  const rewriteTemplatePrefix = VITE_BASE === '/' ? '/src' : VITE_BASE
  const developmentFilenamePrefix = VITE_BASE === '/' ? 'src/' : ''

  const pages = createPages([
    {
      name: 'management',
      filename: isProd ? 'management.html' : `${developmentFilenamePrefix}management/index.html`,
      template: 'src/management/index.html',
      entry: '/src/management/main.js'
    },
    {
      name: 'render',
      filename: isProd ? 'render.html' : `${developmentFilenamePrefix}render/index.html`,
      template: 'src/render/index.html',
      entry: '/src/render/main.js'
    }
  ])

  const mpaPlugin = createMpaPlugin({
    pages,
    verbose: true,
    rewrites: [
      {
        from: new RegExp(joinPath(VITE_BASE, '/render')),
        to: () => normalizePath(`${rewriteTemplatePrefix}/render/index.html`)
      },
      {
        from: new RegExp('^' + joinPath(VITE_BASE, '/management/preview')),
        to: () => normalizePath(`${rewriteTemplatePrefix}/render/index.html`)
      },
      {
        from: new RegExp(`${VITE_BASE}|${joinPath(VITE_BASE, 'management')}/.?`),
        to: () => normalizePath(`${rewriteTemplatePrefix}/management/index.html`)
      }
    ]
  })

  return {
    base: VITE_BASE,
    optimizeDeps: {
      include: [
        'lodash-es',
        'async-validator',
        'vuedraggable',
        'element-plus/es',
        '@wangeditor/editor-for-vue',
        'element-plus/es/components/*/style/index',
        'element-plus/dist/locale/zh-cn.mjs',
        'copy-to-clipboard',
        'qrcode',
        'moment',
        'moment/locale/zh-cn',
        'echarts',
        'nanoid',
        'yup',
        'crypto-js/sha256',
        'element-plus/es/locale/lang/zh-cn',
        'node-forge',
        '@logicflow/core',
        '@logicflow/extension'
      ]
    },
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          // Auto import icon components
          IconsResolver({
            prefix: 'Icon'
          })
        ]
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          }),
          // Auto register icon components
          IconsResolver({
            enabledCollections: ['ep']
          })
        ]
      }),
      Icons({
        autoInstall: true
      }),
      createRedirectPlugin(VITE_BASE),
      mpaPlugin
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)),
        '@management': fileURLToPath(new URL('./src/management', import.meta.url)),
        '@materials': fileURLToPath(new URL('./src/materials', import.meta.url)),
        '@render': fileURLToPath(new URL('./src/render', import.meta.url))
      }
    },
    appType: 'mpa',
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "@/management/styles/element-variables.scss" as *;`
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8080,
      open: false, // 是否自动打开浏览器
      proxy: {
        // '/api': {
        //   target: 'http://127.0.0.1:3000',
        //   changeOrigin: true
        // },
        '/api/survey': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/survey/, '/api')
        },
        '/exportfile': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true
        },
        // 静态文件的默认存储文件夹
        '/userUpload': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true
        }
      }
      // fs: {
      //   allow: [
      //     // 允许访问项目根目录
      //     process.cwd(),
      //     // 允许访问虚拟文件
      //     '/survey'
      //   ]
      // }
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          manualChunks(id) {
            // 建议根据项目生产实际情况进行优化，部分可走cdn或进行小资源包合并
            if (id.includes('element-plus')) {
              return 'element-plus'
            }
            if (id.includes('wangeditor')) {
              return 'wangeditor'
            }
            if (id.includes('node-forg')) {
              return 'node-forg'
            }
            if (id.includes('echarts')) {
              return 'echarts'
            }

            if (id.includes('node_modules')) {
              return 'packages'
            }
          }
        }
      }
    }
  }
})
