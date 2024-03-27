import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

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
    // redirect: '/question',
    component: () =>
      import(/* webpackChunkName: "editPage" */ '../pages/edit/index.vue'),
    children: [
      {
        path: '',
        name: 'QuestionEditIndex',
        
        meta: {
          needLogin: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "QuestionEditIndex" */ '../pages/edit/pages/edit.vue'
          ),
      },
      {
        path: 'setting',
        name: 'QuestionEditSetting',
        meta: {
          needLogin: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "QuestionEditSetting" */ '../pages/edit/pages/setting.vue'
          ),
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
    component: () =>
      import(
        /* webpackChunkName: "analysisPage" */ '../pages/analysis/index.vue'
      ),
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
];

const router = new VueRouter({
  mode: 'history',
  base: '/management',
  routes,
});

router.beforeEach((to, from, next) => {
  const store = router.app.$options.store;
  if (!store?.state?.user?.initialized) {
    store.dispatch('user/init');
  }
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.needLogin) {
    if (store?.state?.user?.hasLogined) {
      next();
    } else {
      next({
        name: 'login',
        query: {
          redirect: encodeURIComponent(to.path),
        },
      });
    }
  } else {
    next();
  }
});

export default router;
