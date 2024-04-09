import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useStore } from 'vuex'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/survey',
  },
  {
    path: '/survey',
    name: 'survey',
    component: () =>
      import(/* webpackChunkName: "survey" */ '../pages/list/index.vue'),
    meta: {
      needLogin: true,
      title: '问卷列表',
    },
  },
  {
    path: '/survey/:id/edit',
    name: 'editPage',
    meta: {
      needLogin: true,
    },
    component: () => import('../pages/edit/index.vue'),
    children: [
      {
        path: '',
        name: 'QuestionEditIndex',
        
        meta: {
          needLogin: true,
        },
        component: () => import('../pages/edit/pages/edit.vue'),
      },
      {
        path: 'setting',
        name: 'QuestionEditSetting',
        meta: {
          needLogin: true,
        },
        component: () => import('../pages/edit/pages/setting.vue'),
      },
      {
        path: 'skin',
        name: 'SkinSetting',
        meta: {
          needLogin: true,
        },
        component: () => import(/* webpackChunkName: "skin" */ '../pages/edit/pages/skin/index.vue'),
        children: [
          {
            path: '',
            name: 'QuestionSkinSetting',
            meta: {
              needLogin: true,
            },
            component: () =>
              import('../pages/edit/pages/skin/content.vue'),
          },
          {
            path: 'result',
            name: 'QuestionEditResultConfig',
            meta: {
              needLogin: true,
            },
            component: () =>
              import('../pages/edit/pages/skin/result.vue'),
          }
        ],
      },
    ],
  },
  {
    path: '/survey/:id/analysis',
    name: 'analysisPage',
    meta: {
      needLogin: true,
    },
    component: () => import( '../pages/analysis/index.vue'),
  },
  {
    path: '/survey/:id/publishResult',
    name: 'publishResultPage',
    meta: {
      needLogin: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "publishResultPage" */ '../pages/publishResult/index.vue'
      ),
  },
  {
    path: '/create',
    name: 'create',
    meta: {
      needLogin: true,
      title: '创建问卷',
    },
    component: () =>
      import(/* webpackChunkName: "create" */ '../pages/create/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../pages/login/index.vue'),
    meta: {
    title: '登陆',
    }
  },
]

const router = createRouter({
  history: createWebHistory('/management'),
  routes,
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
          redirect: encodeURIComponent(to.path),
        },
      })
    }
  } else {
    next()
  }
})

export default router
