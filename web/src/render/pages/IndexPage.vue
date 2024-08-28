<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import { getPublishedSurveyInfo, getPreviewSchema } from '../api/survey'
import useCommandComponent from '../hooks/useCommandComponent'
import { useSurveyStore } from '../stores/survey'

import AlertDialog from '../components/AlertDialog.vue'

const route = useRoute()
const surveyStore = useSurveyStore()
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
      pageConf
    } = data.code
    const questionData = {
      bannerConf,
      baseConf,
      bottomConf,
      dataConf,
      skinConf,
      submitConf,
      pageConf
    }

    if (!pageConf || pageConf?.length == 0) {
      questionData.pageConf = [dataConf.dataList.length]
    }

    document.title = data.title

    surveyStore.setSurveyPath(surveyPath)
    surveyStore.initSurvey(questionData)
    surveyStore.initShowLogicEngine(logicConf?.showLogicConf)
    surveyStore.initJumpLogicEngine(logicConf.jumpLogicConf)
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

watch(
  () => route.query.t,
  () => {
    location.reload()
  }
)

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
