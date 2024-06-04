<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import { getPublishedSurveyInfo } from './api/survey'
import useCommandComponent from './hooks/useCommandComponent'

import AlertDialog from './components/AlertDialog.vue'
import { get as _get  } from 'lodash-es'
import { initRuleEngine } from '@/render/hooks/useRuleEngine.js'

const store = useStore()
const route = useRoute()
const router = useRouter()
const skinConf = computed(() => _get(store, 'state.skinConf', {}))

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

watch(skinConf, (value) => {
  updateSkinConfig(value)
})
watch(() => route.params.surveyId, (surveyId)=> {
    router.push({name: 'indexPage', params: {surveyId: surveyId} })
    store.commit('setSurveyPath', surveyId)
    getDetail(surveyId as string)
})

const getDetail = async (surveyPath: string) => {
  const alert = useCommandComponent(AlertDialog)

  try {
    const res: any = await getPublishedSurveyInfo({ surveyPath })

    if (res.code === 200) {
      const data = res.data
      const { bannerConf, baseConf, bottomConf, dataConf, skinConf, submitConf, logicConf } =
        data.code
      const questionData = {
        bannerConf,
        baseConf,
        bottomConf,
        dataConf,
        skinConf,
        submitConf
      }

      document.title = data.title

      updateSkinConfig(skinConf)

      // store.commit('setSurveyPath', surveyPath)
      store.dispatch('init', questionData)
      store.dispatch('getEncryptInfo')
      initRuleEngine(logicConf?.showLogicConf)
    } else {
      throw new Error(res.errmsg)
    }
  } catch (error: any) {
    console.log(error)
    alert({ title: error.message || '获取问卷失败' })
  }
}

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
