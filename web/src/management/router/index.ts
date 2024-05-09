import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useStore } from 'vuex'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/survey'
  },
  {
    path: '/survey',
    name: 'survey',
    // @ts-ignore
    component: () => import('../pages/list/index.vue'),
    meta: {
      needLogin: true,
      title: '问卷列表'
    }
  },
  {
    path: '/survey/:id/edit',
    meta: {
      needLogin: true
    },
    name: 'QuestionEdit',
    // @ts-ignore
    component: () => import('../pages/edit/index.vue'),
    children: [
      {
        path: '',
        meta: {
          needLogin: true
        },
        name: 'QuestionEditPage',
        component: () =>
          // @ts-ignore
              import('../pages/edit/pages/edit/index.vue'),
        children: [
          {
            path: '',
            name: 'QuestionEditIndex',
            meta: {
              needLogin: true,
            },
            component: () =>
              // @ts-ignore
              import('../pages/edit/pages/edit/QuestionEdit.vue'),
          },
          {
            path: 'logic',
            name: 'LogicIndex',
            meta: {
              needLogin: true,
            },
            component: () =>
              // @ts-ignore
              import('../pages/edit/pages/edit/LogicEdit.vue'),
          }
        ],
      },
      {
        path: 'setting',
        name: 'QuestionEditSetting',
        meta: {
          needLogin: true
        },
        // @ts-ignore
        component: () => import('../pages/edit/pages/Setting.vue')
      },
      {
        path: 'skin',
        meta: {
          needLogin: true
        },
        // @ts-ignore
        component: () => import('../pages/edit/pages/skin/index.vue'),
        children: [
          {
            path: '',
            name: 'QuestionSkinSetting',
            meta: {
              needLogin: true
            },
            // @ts-ignore
            component: () => import('../pages/edit/pages/skin/Content.vue')
          },
          {
            path: 'result',
            name: 'QuestionEditResultConfig',
            meta: {
              needLogin: true
            },
            // @ts-ignore
            component: () => import('../pages/edit/pages/skin/Result.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/survey/:id/analysis',
    name: 'analysisPage',
    meta: {
      needLogin: true
    },
    // @ts-ignore
    component: () => import('../pages/analysis/AnalysisPage.vue')
  },
  {
    path: '/survey/:id/publishResult',
    name: 'publishResultPage',
    meta: {
      needLogin: true
    },
    // @ts-ignore
    component: () => import('../pages/publishResult/PublishResultPage.vue')
  },
  {
    path: '/create',
    name: 'create',
    meta: {
      needLogin: true,
      title: '创建问卷'
    },
    // @ts-ignore
    component: () => import('../pages/create/CreatePage.vue')
  },
  {
    path: '/login',
    name: 'login',
    // @ts-ignore
    component: () => import('../pages/login/LoginPage.vue'),
    meta: {
      title: '登陆'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/management'),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useStore()
  if (!store.state.user?.initialized) {
    store?.dispatch('user/init')
  }
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  if (to.meta.needLogin) {
    if (store?.state?.user?.hasLogined) {
      next()
    } else {
      next({
        name: 'login',
        query: {
          redirect: encodeURIComponent(to.path)
        }
      })
    }
  } else {
    next()
  }
})

export default router
