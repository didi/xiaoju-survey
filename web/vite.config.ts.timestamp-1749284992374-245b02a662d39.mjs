// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig, normalizePath } from "file:///D:/XiaojuSurvey/web/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/XiaojuSurvey/web/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/XiaojuSurvey/web/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { createMpaPlugin, createPages } from "file:///D:/XiaojuSurvey/web/node_modules/vite-plugin-virtual-mpa/dist/index.mjs";
import AutoImport from "file:///D:/XiaojuSurvey/web/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/XiaojuSurvey/web/node_modules/unplugin-vue-components/dist/vite.js";
import Icons from "file:///D:/XiaojuSurvey/web/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///D:/XiaojuSurvey/web/node_modules/unplugin-icons/dist/resolver.js";
import { ElementPlusResolver } from "file:///D:/XiaojuSurvey/web/node_modules/unplugin-vue-components/dist/resolvers.js";

// report.ts
import fs from "file:///D:/XiaojuSurvey/web/node_modules/fs-extra/lib/index.js";
var fsa = fs.promises;
process.env.XIAOJU_SURVEY_REPORT = "true";
var readData = async (pkg) => {
  const id = (/* @__PURE__ */ new Date()).getTime().toString();
  try {
    if (!fs.existsSync(pkg)) {
      return {
        type: "web",
        name: "",
        version: "",
        description: "",
        id,
        msg: "\u6587\u4EF6\u4E0D\u5B58\u5728"
      };
    }
    const data = await fsa.readFile(pkg, "utf8").catch((e) => e);
    const { name, version, description } = JSON.parse(data);
    return { type: "web", name, version, description, id };
  } catch (error) {
    return error;
  }
};
var report = async () => {
  if (!process.env.XIAOJU_SURVEY_REPORT) {
    return;
  }
  const res = await readData("./package.json");
  fetch && fetch("https://xiaojusurveysrc.didi.cn/reportSourceData", {
    method: "POST",
    headers: {
      Accept: "application/json, */*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(res)
  }).catch(() => {
  });
};
report();

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///D:/XiaojuSurvey/web/vite.config.ts";
var isProd = process.env.NODE_ENV === "production";
var pages = createPages([
  {
    name: "management",
    filename: isProd ? "management.html" : "src/management/index.html",
    template: "src/management/index.html",
    entry: "/src/management/main.js"
  },
  {
    name: "render",
    filename: isProd ? "render.html" : "src/render/index.html",
    template: "src/render/index.html",
    entry: "/src/render/main.js"
  }
]);
var mpaPlugin = createMpaPlugin({
  pages,
  verbose: true,
  rewrites: [
    {
      from: /render/,
      to: () => normalizePath("/src/render/index.html")
    },
    {
      from: /management\/preview/,
      to: () => normalizePath("/src/render/index.html")
    },
    {
      from: /\/|\/management\/.?/,
      to: () => normalizePath("/src/management/index.html")
    }
  ]
});
var vite_config_default = defineConfig({
  optimizeDeps: {
    include: [
      "lodash-es",
      "async-validator",
      "vuedraggable",
      "element-plus/es",
      "@wangeditor/editor-for-vue",
      "element-plus/es/components/*/style/index",
      "element-plus/dist/locale/zh-cn.mjs",
      "copy-to-clipboard",
      "qrcode",
      "moment",
      "moment/locale/zh-cn",
      "echarts",
      "nanoid",
      "yup",
      "crypto-js/sha256",
      "element-plus/es/locale/lang/zh-cn",
      "node-forge",
      "@logicflow/core",
      "@logicflow/extension"
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
          prefix: "Icon"
        })
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass"
        }),
        // Auto register icon components
        IconsResolver({
          enabledCollections: ["ep"]
        })
      ]
    }),
    Icons({
      autoInstall: true
    }),
    mpaPlugin
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "@management": fileURLToPath(new URL("./src/management", __vite_injected_original_import_meta_url)),
      "@materials": fileURLToPath(new URL("./src/materials", __vite_injected_original_import_meta_url)),
      "@render": fileURLToPath(new URL("./src/render", __vite_injected_original_import_meta_url))
    }
  },
  appType: "mpa",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `@use "@/management/styles/element-variables.scss" as *;`
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    open: false,
    // 是否自动打开浏览器
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true
      },
      "/exportfile": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true
      },
      // 静态文件的默认存储文件夹
      "/userUpload": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "[ext]/[name]-[hash].[ext]",
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        manualChunks(id) {
          if (id.includes("element-plus")) {
            return "element-plus";
          }
          if (id.includes("wangeditor")) {
            return "wangeditor";
          }
          if (id.includes("node-forg")) {
            return "node-forg";
          }
          if (id.includes("echarts")) {
            return "echarts";
          }
          if (id.includes("node_modules")) {
            return "packages";
          }
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicmVwb3J0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcWGlhb2p1U3VydmV5XFxcXHdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcWGlhb2p1U3VydmV5XFxcXHdlYlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovWGlhb2p1U3VydmV5L3dlYi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIG5vcm1hbGl6ZVBhdGggfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlTXBhUGx1Z2luLCBjcmVhdGVQYWdlcyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZpcnR1YWwtbXBhJ1xyXG5cclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXHJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJ1xyXG5cclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuXHJcbmltcG9ydCAnLi9yZXBvcnQnXHJcblxyXG5jb25zdCBpc1Byb2QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nXHJcblxyXG5jb25zdCBwYWdlcyA9IGNyZWF0ZVBhZ2VzKFtcclxuICB7XHJcbiAgICBuYW1lOiAnbWFuYWdlbWVudCcsXHJcbiAgICBmaWxlbmFtZTogaXNQcm9kID8gJ21hbmFnZW1lbnQuaHRtbCcgOiAnc3JjL21hbmFnZW1lbnQvaW5kZXguaHRtbCcsXHJcbiAgICB0ZW1wbGF0ZTogJ3NyYy9tYW5hZ2VtZW50L2luZGV4Lmh0bWwnLFxyXG4gICAgZW50cnk6ICcvc3JjL21hbmFnZW1lbnQvbWFpbi5qcydcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdyZW5kZXInLFxyXG4gICAgZmlsZW5hbWU6IGlzUHJvZCA/ICdyZW5kZXIuaHRtbCcgOiAnc3JjL3JlbmRlci9pbmRleC5odG1sJyxcclxuICAgIHRlbXBsYXRlOiAnc3JjL3JlbmRlci9pbmRleC5odG1sJyxcclxuICAgIGVudHJ5OiAnL3NyYy9yZW5kZXIvbWFpbi5qcydcclxuICB9XHJcbl0pXHJcbmNvbnN0IG1wYVBsdWdpbiA9IGNyZWF0ZU1wYVBsdWdpbih7XHJcbiAgcGFnZXMsXHJcbiAgdmVyYm9zZTogdHJ1ZSxcclxuICByZXdyaXRlczogW1xyXG4gICAge1xyXG4gICAgICBmcm9tOiAvcmVuZGVyLyxcclxuICAgICAgdG86ICgpID0+IG5vcm1hbGl6ZVBhdGgoJy9zcmMvcmVuZGVyL2luZGV4Lmh0bWwnKVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgZnJvbTogL21hbmFnZW1lbnRcXC9wcmV2aWV3LyxcclxuICAgICAgdG86ICgpID0+IG5vcm1hbGl6ZVBhdGgoJy9zcmMvcmVuZGVyL2luZGV4Lmh0bWwnKVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgZnJvbTogL1xcL3xcXC9tYW5hZ2VtZW50XFwvLj8vLFxyXG4gICAgICB0bzogKCkgPT4gbm9ybWFsaXplUGF0aCgnL3NyYy9tYW5hZ2VtZW50L2luZGV4Lmh0bWwnKVxyXG4gICAgfVxyXG4gIF1cclxufSlcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBpbmNsdWRlOiBbXHJcbiAgICAgICdsb2Rhc2gtZXMnLFxyXG4gICAgICAnYXN5bmMtdmFsaWRhdG9yJyxcclxuICAgICAgJ3Z1ZWRyYWdnYWJsZScsXHJcbiAgICAgICdlbGVtZW50LXBsdXMvZXMnLFxyXG4gICAgICAnQHdhbmdlZGl0b3IvZWRpdG9yLWZvci12dWUnLFxyXG4gICAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvKi9zdHlsZS9pbmRleCcsXHJcbiAgICAgICdlbGVtZW50LXBsdXMvZGlzdC9sb2NhbGUvemgtY24ubWpzJyxcclxuICAgICAgJ2NvcHktdG8tY2xpcGJvYXJkJyxcclxuICAgICAgJ3FyY29kZScsXHJcbiAgICAgICdtb21lbnQnLFxyXG4gICAgICAnbW9tZW50L2xvY2FsZS96aC1jbicsXHJcbiAgICAgICdlY2hhcnRzJyxcclxuICAgICAgJ25hbm9pZCcsXHJcbiAgICAgICd5dXAnLFxyXG4gICAgICAnY3J5cHRvLWpzL3NoYTI1NicsXHJcbiAgICAgICdlbGVtZW50LXBsdXMvZXMvbG9jYWxlL2xhbmcvemgtY24nLFxyXG4gICAgICAnbm9kZS1mb3JnZScsXHJcbiAgICAgICdAbG9naWNmbG93L2NvcmUnLFxyXG4gICAgICAnQGxvZ2ljZmxvdy9leHRlbnNpb24nXHJcbiAgICBdXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIHZ1ZUpzeCgpLFxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgICAvLyBBdXRvIGltcG9ydCBpY29uIGNvbXBvbmVudHNcclxuICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgIHByZWZpeDogJ0ljb24nXHJcbiAgICAgICAgfSlcclxuICAgICAgXVxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcih7XHJcbiAgICAgICAgICBpbXBvcnRTdHlsZTogJ3Nhc3MnXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgLy8gQXV0byByZWdpc3RlciBpY29uIGNvbXBvbmVudHNcclxuICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogWydlcCddXHJcbiAgICAgICAgfSlcclxuICAgICAgXVxyXG4gICAgfSksXHJcbiAgICBJY29ucyh7XHJcbiAgICAgIGF1dG9JbnN0YWxsOiB0cnVlXHJcbiAgICB9KSxcclxuICAgIG1wYVBsdWdpblxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgICdAbWFuYWdlbWVudCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvbWFuYWdlbWVudCcsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICAnQG1hdGVyaWFscyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvbWF0ZXJpYWxzJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgICdAcmVuZGVyJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYy9yZW5kZXInLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYXBwVHlwZTogJ21wYScsXHJcbiAgY3NzOiB7XHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBhcGk6ICdtb2Rlcm4tY29tcGlsZXInLFxyXG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQHVzZSBcIkAvbWFuYWdlbWVudC9zdHlsZXMvZWxlbWVudC12YXJpYWJsZXMuc2Nzc1wiIGFzICo7YFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgIHBvcnQ6IDgwODAsXHJcbiAgICBvcGVuOiBmYWxzZSwgLy8gXHU2NjJGXHU1NDI2XHU4MUVBXHU1MkE4XHU2MjUzXHU1RjAwXHU2RDRGXHU4OUM4XHU1NjY4XHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICAnL2V4cG9ydGZpbGUnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTozMDAwJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcclxuICAgICAgfSxcclxuICAgICAgLy8gXHU5NzU5XHU2MDAxXHU2NTg3XHU0RUY2XHU3Njg0XHU5RUQ4XHU4QkE0XHU1QjU4XHU1MEE4XHU2NTg3XHU0RUY2XHU1OTM5XHJcbiAgICAgICcvdXNlclVwbG9hZCc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF0nLFxyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcclxuICAgICAgICAgIC8vIFx1NUVGQVx1OEJBRVx1NjgzOVx1NjM2RVx1OTg3OVx1NzZFRVx1NzUxRlx1NEVBN1x1NUI5RVx1OTY0NVx1NjBDNVx1NTFCNVx1OEZEQlx1ODg0Q1x1NEYxOFx1NTMxNlx1RkYwQ1x1OTBFOFx1NTIwNlx1NTNFRlx1OEQ3MGNkblx1NjIxNlx1OEZEQlx1ODg0Q1x1NUMwRlx1OEQ0NFx1NkU5MFx1NTMwNVx1NTQwOFx1NUU3NlxyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdlbGVtZW50LXBsdXMnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2VsZW1lbnQtcGx1cydcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnd2FuZ2VkaXRvcicpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnd2FuZ2VkaXRvcidcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZS1mb3JnJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdub2RlLWZvcmcnXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2VjaGFydHMnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2VjaGFydHMnXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3BhY2thZ2VzJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxYaWFvanVTdXJ2ZXlcXFxcd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxYaWFvanVTdXJ2ZXlcXFxcd2ViXFxcXHJlcG9ydC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovWGlhb2p1U3VydmV5L3dlYi9yZXBvcnQudHNcIjtpbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnXHJcblxyXG5jb25zdCBmc2EgPSBmcy5wcm9taXNlc1xyXG5cclxucHJvY2Vzcy5lbnYuWElBT0pVX1NVUlZFWV9SRVBPUlQgPSAndHJ1ZSdcclxuXHJcbmNvbnN0IHJlYWREYXRhID0gYXN5bmMgKHBrZzogc3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgaWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpXHJcbiAgdHJ5IHtcclxuICAgIGlmICghZnMuZXhpc3RzU3luYyhwa2cpKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogJ3dlYicsXHJcbiAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgdmVyc2lvbjogJycsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIG1zZzogJ1x1NjU4N1x1NEVGNlx1NEUwRFx1NUI1OFx1NTcyOCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGZzYS5yZWFkRmlsZShwa2csICd1dGY4JykuY2F0Y2goKGUpID0+IGUpXHJcbiAgICBjb25zdCB7IG5hbWUsIHZlcnNpb24sIGRlc2NyaXB0aW9uIH0gPSBKU09OLnBhcnNlKGRhdGEpXHJcbiAgICByZXR1cm4geyB0eXBlOiAnd2ViJywgbmFtZSwgdmVyc2lvbiwgZGVzY3JpcHRpb24sIGlkIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmV0dXJuIGVycm9yXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCByZXBvcnQgPSBhc3luYyAoKSA9PiB7XHJcbiAgaWYgKCFwcm9jZXNzLmVudi5YSUFPSlVfU1VSVkVZX1JFUE9SVCkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICBjb25zdCByZXMgPSBhd2FpdCByZWFkRGF0YSgnLi9wYWNrYWdlLmpzb24nKVxyXG5cclxuICAvLyBcdTRFMEFcdTYyQTVcclxuICBmZXRjaCAmJlxyXG4gICAgZmV0Y2goJ2h0dHBzOi8veGlhb2p1c3VydmV5c3JjLmRpZGkuY24vcmVwb3J0U291cmNlRGF0YScsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uLCAqLyonLFxyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgfSxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocmVzKVxyXG4gICAgfSkuY2F0Y2goKCkgPT4ge30pXHJcbn1cclxuXHJcbnJlcG9ydCgpXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVAsU0FBUyxlQUFlLFdBQVc7QUFDcFIsU0FBUyxjQUFjLHFCQUFxQjtBQUM1QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBRW5CLFNBQVMsaUJBQWlCLG1CQUFtQjtBQUU3QyxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFFMUIsU0FBUywyQkFBMkI7OztBQ1ptTSxPQUFPLFFBQVE7QUFFdFAsSUFBTSxNQUFNLEdBQUc7QUFFZixRQUFRLElBQUksdUJBQXVCO0FBRW5DLElBQU0sV0FBVyxPQUFPLFFBQWdCO0FBQ3RDLFFBQU0sTUFBSyxvQkFBSSxLQUFLLEdBQUUsUUFBUSxFQUFFLFNBQVM7QUFDekMsTUFBSTtBQUNGLFFBQUksQ0FBQyxHQUFHLFdBQVcsR0FBRyxHQUFHO0FBQ3ZCLGFBQU87QUFBQSxRQUNMLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULGFBQWE7QUFBQSxRQUNiO0FBQUEsUUFD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
