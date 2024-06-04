<template>
  <div id="app">
    <Component
      v-if="store.state.router"
      :is="
        components[
          upperFirst(store.state.router) as 'IndexPage' | 'EmptyPage' | 'ErrorPage' | 'SuccessPage'
        ]
      "
    >
    </Component>
    <LogoIcon
      v-if="!['successPage', 'indexPage'].includes(store.state.router)"
      :logo-conf="logoConf"
      :readonly="true"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'

import { getPublishedSurveyInfo, getPreviewSchema } from './api/survey'
import useCommandComponent from './hooks/useCommandComponent'

import EmptyPage from './pages/EmptyPage.vue'
import IndexPage from './pages/IndexPage.vue'
import ErrorPage from './pages/ErrorPage.vue'
import SuccessPage from './pages/SuccessPage.vue'
import AlertDialog from './components/AlertDialog.vue'
// @ts-ignore
import communalLoader from '@materials/communals/communalLoader.js'
import { get as _get, upperFirst } from 'lodash-es'
import { initRuleEngine } from '@/render/hooks/useRuleEngine.js'

const LogoIcon = communalLoader.loadComponent('LogoIcon')

const store = useStore()
const logoConf = computed(() => store.state?.bottomConf || {})
const skinConf = computed(() => _get(store, 'state.skinConf', {}))
const components = {
  EmptyPage,
  IndexPage,
  ErrorPage,
  SuccessPage
}

const updateSkinConfig = (value: any) => {
  const root = document.documentElement
  const { themeConf, backgroundConf, contentConf } = value

  if (themeConf?.color) {
    // 设置主题颜色
    root.style.setProperty('--primary-color', themeConf?.color)
  }

  if (backgroundConf?.color) {
    // 设置背景颜色
    root.style.setProperty('--primary-background-color', backgroundConf?.color)
  }

  if (contentConf?.opacity.toString()) {
    // 设置全局透明度
    root.style.setProperty('--opacity', `${parseInt(contentConf.opacity) / 100}`)
  }
}

const loadData = (res: any, surveyPath: string) => {
  if (res.code === 200) {
    const data = res.data
    const {
      bannerConf,
      baseConf,
      bottomConf,
      dataConf,
      skinConf,
      submitConf,
      logicConf,
      isPreview
    } = data.code
    const questionData = {
      bannerConf,
      baseConf,
      bottomConf,
      dataConf,
      skinConf,
      submitConf,
      isPreview
    }

    document.title = data.title

    updateSkinConfig(skinConf)

    store.commit('setSurveyPath', surveyPath)
    store.dispatch('init', questionData)
    store.dispatch('getEncryptInfo')
    initRuleEngine(logicConf?.showLogicConf)
  } else {
    throw new Error(res.errmsg)
  }
}

watch(skinConf, (value) => {
  updateSkinConfig(value)
})

onMounted(async () => {
  const surveyPath = location.pathname.split('/').pop()

  if (!surveyPath) {
    store.commit('setRouter', 'EmptyPage')
    return
  }

  const alert = useCommandComponent(AlertDialog)
  try {
    if (surveyPath.length > 8) {
      const res: any = await getPreviewSchema({ surveyPath })
      loadData(res, surveyPath)
    } else {
      const res: any = await getPublishedSurveyInfo({ surveyPath })
      loadData(res, surveyPath)
    }
  } catch (error: any) {
    console.log(error)
    alert({ title: error.message || '获取问卷失败' })
  }
})
</script>
<style lang="scss">
@import url('./styles/icon.scss');
@import url('../materials/questions/common/css/icon.scss');
@import url('./styles/reset.scss');

html {
  background: #f7f7f7;
}

#app {
  position: relative;
  overflow-x: hidden;
  width: 100%;
  max-width: 750px;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #fff;
}
</style>
