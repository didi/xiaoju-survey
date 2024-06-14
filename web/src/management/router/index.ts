import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useStore } from 'vuex'
import { SurveyPermissions } from '@/management/utils/types/workSpace'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/survey'
  },
  {
    path: '/survey',
    name: 'survey',
    component: () => import('../pages/list/index.vue'),
    meta: {
      needLogin: true,
      title: '问卷列表'
    }
  },
  {
    path: '/survey/download/',
    name: 'download',
    component: () => import('../pages/download/SurveyDownloadPage.vue'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/survey/:id/edit',
    meta: {
      needLogin: true,
      premissions: [SurveyPermissions.SurveyManage]
    },
    name: 'QuestionEdit',
    component: () => import('../pages/edit/index.vue'),
    children: [
      {
        path: '',
        meta: {
          needLogin: true
        },
        name: 'QuestionEditPage',
        component: () => import('../pages/edit/pages/edit/index.vue'),
        children: [
          {
            path: '',
            name: 'QuestionEditIndex',
            meta: {
              needLogin: true
            },
            component: () => import('../pages/edit/pages/edit/QuestionEditPage.vue')
          },
          {
            path: 'logic',
            name: 'LogicIndex',
            meta: {
              needLogin: true
            },
            component: () => import('../pages/edit/pages/edit/LogicEditPage.vue')
          }
        ]
      },
      {
        path: 'setting',
        name: 'QuestionEditSetting',
        meta: {
          needLogin: true
        },
        component: () => import('../pages/edit/pages/setting/index.vue')
      },
      {
        path: 'skin',
        meta: {
          needLogin: true
        },
        component: () => import('../pages/edit/pages/skin/index.vue'),
        children: [
          {
            path: '',
            name: 'QuestionSkinSetting',
            meta: {
              needLogin: true
            },
            component: () => import('../pages/edit/pages/skin/ContentPage.vue')
          },
          {
            path: 'result',
            name: 'QuestionEditResultConfig',
            meta: {
              needLogin: true
            },
            component: () => import('../pages/edit/pages/skin/ResultPage.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/survey/:id/analysis',
    name: 'analysisPage',
    meta: {
      needLogin: true,
      premissions: [SurveyPermissions.DataManage]
    },
    component: () => import('../pages/analysis/AnalysisPage.vue')
  },
  {
    path: '/survey/:id/publish',
    name: 'publish',
    meta: {
      needLogin: true,
      premissions: [SurveyPermissions.SurveyManage]
    },
    component: () => import('../pages/publish/PublishPage.vue')
  },
  {
    path: '/create',
    name: 'create',
    meta: {
      needLogin: true,
      title: '创建问卷'
    },
    component: () => import('../pages/create/CreatePage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/LoginPage.vue'),
    meta: {
      title: '登录'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/management'),
  routes
})

router.beforeEach(async (to, from, next) => {
  const store = useStore()
  if (!store.state.user?.initialized) {
    store?.dispatch('user/init')
  }
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  if (to.meta.needLogin) {
    if (store?.state?.user?.hasLogined) {
      if (to.meta.premissions) {
        const params = to.params
        await store.dispatch('fetchCooperPermissions', params.id)
        if (
          (to.meta.premissions as []).some((permission) =>
            store.state?.cooperPermissions?.includes(permission)
          )
        ) {
          next()
        } else {
          ElMessage.warning('您没有该问卷的相关协作权限')
          next({
            name: 'survey'
          })
        }
      } else {
        next()
      }
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

// router.afterEach(async (to, from) => {
//   const store = useStore()
//   if (to.meta.premissions) {
//     const params = to.params
//     await store.dispatch('fetchCooperPermissions', params.id)
//     if (!(to.meta.premissions as []).some((permission) => store.state?.cooperPermissions?.includes(permission))) {
//       ElMessage.warning('您没有该问卷的相关协作权限')
//       router.push({
//         name: 'survey'
//       })
//     }
//   }
// })
export default router
