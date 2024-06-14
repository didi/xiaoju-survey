import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

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
const router = createRouter({
  history: createWebHistory(base),
  routes
})

export default router
