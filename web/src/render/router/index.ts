import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { joinPath } from '@/common/utils/path'

const routes: RouteRecordRaw[] = [
  {
    path: '/:surveyId',
    component: () => import('../pages/IndexPage.vue'),
    children: [
      {
        path: '',
        name: 'renderPage',
        component: () => import('../pages/RenderPage.vue')
      },
      {
        path: 'success',
        name: 'successPage',
        component: () => import('../pages/SuccessPage.vue')
      },
      {
        path: 'error',
        name: 'errorPage',
        component: () => import('../pages/ErrorPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'emptyPage',
    component: () => import('../pages/EmptyPage.vue')
  }
]
// 兼容预览模式
const base = window.location.pathname.includes('preview') ? 'management/preview' : 'render'
const finalBase = joinPath(import.meta.env.VITE_BASE, base)

const router = createRouter({
  history: createWebHistory(finalBase),
  routes
})

export default router
