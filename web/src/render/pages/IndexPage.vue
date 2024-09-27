<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPublishedSurveyInfo, getPreviewSchema } from '../api/survey'
import AlertDialog from '../components/AlertDialog.vue'
import { useSurveyStore } from '../stores/survey'
import useCommandComponent from '../hooks/useCommandComponent'

const route = useRoute()
const surveyStore = useSurveyStore()

watch(
  () => route.query.t,
  (t) => {
    if (t) location.reload()
  }
)

onMounted(() => {
  const surveyId = route.params.surveyId
  console.log({ surveyId })
  surveyStore.setSurveyPath(surveyId)
  getDetail(surveyId as string)
})
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
    surveyStore.initJumpLogicEngine(logicConf?.jumpLogicConf)
  } else {
    throw new Error(res.errmsg)
  }
}

function isObjectId(id: string) {  
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;  
  return objectIdRegex.test(id);  
}  

const getDetail = async (surveyPath: string) => {
  const alert = useCommandComponent(AlertDialog)
  try {
    if (isObjectId(surveyPath)) {
      const res: any = await getPreviewSchema({ surveyPath })
      loadData(res, surveyPath)
    } else {
      const res: any = await getPublishedSurveyInfo({ surveyPath })
      // checkStatus(res.data)
      loadData(res, surveyPath)
      surveyStore.getEncryptInfo()
    }
  } catch (error: any) {
    console.log(error)
    alert({ title: error.message || '获取问卷失败' })
  }
}
</script>
