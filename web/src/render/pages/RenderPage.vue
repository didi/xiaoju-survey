<template>
  <div class="index">
    <ProgressBar />
    <div class="wrapper" ref="boxRef">
      <HeaderContent v-if="pageIndex == 1" :bannerConf="bannerConf" :readonly="true" />
      <div class="content">
        <MainTitle v-if="pageIndex == 1" :bannerConf="bannerConf" :readonly="true"></MainTitle>
        <MainRenderer ref="mainRef"></MainRenderer>
        <SubmitButton
          :validate="validate"
          :submitConf="submitConf"
          :readonly="true"
          :isFinallyPage="isFinallyPage"
          :renderData="renderData"
          @submit="handleSubmit"
        ></SubmitButton>
      </div>
      <LogoIcon :logo-conf="logoConf" :readonly="true" />
      <VerifyDialog />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
// @ts-ignore
import communalLoader from '@materials/communals/communalLoader.js'

import useCommandComponent from '../hooks/useCommandComponent'
import MainRenderer from '../components/MainRenderer.vue'
import AlertDialog from '../components/AlertDialog.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import VerifyDialog from '../components/VerifyDialog/index.vue'

import ProgressBar from '../components/ProgressBar.vue'

import { useSurveyStore } from '../stores/survey'
import { useQuestionStore } from '../stores/question'
import { submitForm } from '../api/survey'
import encrypt from '../utils/encrypt'
import {
  clearSurveyData,
  setSurveyData,
  clearSurveySubmit,
  setSurveySubmit
} from '../utils/storage'

interface Props {
  questionInfo?: any
  isMobile?: boolean
}

withDefaults(defineProps<Props>(), {
  questionInfo: {},
  isMobile: false
})

const HeaderContent = communalLoader.loadComponent('HeaderContent')
const MainTitle = communalLoader.loadComponent('MainTitle')
const SubmitButton = communalLoader.loadComponent('SubmitButton')
const LogoIcon = communalLoader.loadComponent('LogoIcon')

const mainRef = ref<any>()
const boxRef = ref<HTMLElement>()

const alert = useCommandComponent(AlertDialog)
const confirm = useCommandComponent(ConfirmDialog)

const router = useRouter()
const surveyStore = useSurveyStore()
const questionStore = useQuestionStore()

const renderData = computed(() => questionStore.renderData)
const isFinallyPage = computed(() => questionStore.isFinallyPage)
const pageIndex = computed(() => questionStore.pageIndex)
const { bannerConf, submitConf, bottomConf: logoConf, whiteData } = storeToRefs(surveyStore)
const surveyPath = computed(() => surveyStore.surveyPath || '')

const validate = (callback: (v: boolean) => void) => {
  const index = 0
  mainRef.value.$refs.formGroup[index].validate(callback)
}

const normalizationRequestBody = () => {
  const enterTime = surveyStore.enterTime
  const encryptInfo: any = surveyStore.encryptInfo
  const formValues = surveyStore.formValues
  const baseConf: any = surveyStore.baseConf

  const result: any = {
    surveyPath: surveyPath.value,
    data: JSON.stringify(formValues),
    diffTime: Date.now() - enterTime,
    clientTime: Date.now(),
    ...whiteData.value
  }

  // 自动回填开启时，记录数据
  if (baseConf.fillSubmitAnswer) {
    clearSurveyData(surveyPath.value)
    clearSurveySubmit(surveyPath.value)

    setSurveyData(surveyPath.value, formValues)
    setSurveySubmit(surveyPath.value, 1)
  }

  // 数据加密
  if (encryptInfo?.encryptType) {
    result.encryptType = encryptInfo.encryptType

    result.data = encrypt[result.encryptType as 'rsa']({
      data: result.data,
      secretKey: encryptInfo?.data?.secretKey
    })

    if (encryptInfo?.data?.sessionId) {
      result.sessionId = encryptInfo.data.sessionId
    }
  } else {
    result.data = JSON.stringify(result.data)
  }

  return result
}

const submitSurvey = async () => {
  if (surveyPath.value.length > 8) {
    router.push({ name: 'successPage' })
    return
  }
  try {
    const params = normalizationRequestBody()
    const res: any = await submitForm(params)
    if (res.code === 200) {
      router.replace({ name: 'successPage' })
    } else {
      alert({
        title: res.errmsg || '提交失败'
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const handleSubmit = () => {
  const confirmAgain = (surveyStore.submitConf as any).confirmAgain
  const { again_text, is_again } = confirmAgain
  if (!isFinallyPage.value) {
    questionStore.addPageIndex()
    return
  }
  if (is_again) {
    confirm({
      title: again_text,
      onConfirm: async () => {
        try {
          submitSurvey()
        } catch (error) {
          console.log(error)
        } finally {
          confirm.close()
        }
      }
    })
  } else {
    submitSurvey()
  }
}
</script>
<style scoped lang="scss">
.index {
  min-height: 100%;

  .wrapper {
    min-height: 100%;
    display: flex;
    flex-direction: column;

    .content {
      flex: 1;
      background: rgba(255, 255, 255, var(--opacity));
      border-radius: 8px 8px 0 0;
      height: 100%;
    }
  }
}
</style>
