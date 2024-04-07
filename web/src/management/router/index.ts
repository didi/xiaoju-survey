import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'

const routes = [
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
        path: 'resultConfig',
        name: 'QuestionEditResultConfig',
        meta: {
          needLogin: true,
        },
        beforeEnter(to){
          console.log('result config to', to)
        },
        component: () => import( '../pages/edit/pages/resultConfig.vue' ),
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
    title: '登陆',
    component: () =>
      import(/* webpackChunkName: "login" */ '../pages/login/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('management'),
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
