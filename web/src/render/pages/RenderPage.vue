<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import { getPublishedSurveyInfo } from '../api/survey'
import useCommandComponent from '../hooks/useCommandComponent'

import AlertDialog from '../components/AlertDialog.vue'
import { initRuleEngine } from '@/render/hooks/useRuleEngine.js'

const store = useStore()
const route = useRoute()

onMounted(() => {
  const surveyId = route.params.surveyId
  console.log({ surveyId })
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

      store.commit('setSurveyPath', surveyPath)
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
