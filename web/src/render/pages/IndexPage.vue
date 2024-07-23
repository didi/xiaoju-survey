<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { getPublishedSurveyInfo, getPreviewSchema } from '../api/survey'
import useCommandComponent from '../hooks/useCommandComponent'
import { useSurveyStore } from '../stores/survey'

import AlertDialog from '../components/AlertDialog.vue'
import { initRuleEngine } from '@/render/hooks/useRuleEngine.js'
const route = useRoute()
const surveyStore = useSurveyStore()
const loadData = (res: any, surveyPath: string) => {
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

    surveyStore.setSurveyPath(surveyPath)
    surveyStore.initSurvey(questionData)
    initRuleEngine(logicConf?.showLogicConf)
  } else {
    throw new Error(res.errmsg)
  }
}
onMounted(() => {
  const surveyId = route.params.surveyId
  console.log({ surveyId })
  surveyStore.setSurveyPath(surveyId)
  getDetail(surveyId as string)
})

const getDetail = async (surveyPath: string) => {
  const alert = useCommandComponent(AlertDialog)

  try {
    if (surveyPath.length > 8) {
      const res: any = await getPreviewSchema({ surveyPath })
      loadData(res, surveyPath)
    } else {
      const res: any = await getPublishedSurveyInfo({ surveyPath })
      loadData(res, surveyPath)
      surveyStore.getEncryptInfo()
    }
  } catch (error: any) {
    console.log(error)
    alert({ title: error.message || '获取问卷失败' })
  }
}
</script>
