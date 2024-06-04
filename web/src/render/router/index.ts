import { createRouter, createWebHistory, type  RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/render/:surveyId',
    children: [
      {
        path: '',
        name: 'indexPage',
        component: () => import('../pages/IndexPage.vue'),
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

const router = createRouter({
  history: createWebHistory('/management'),
  routes
})
export default router