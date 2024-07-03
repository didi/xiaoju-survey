<template>
  <div class="index">
    <ProgressBar />
    <div class="wrapper" ref="boxRef">
      <HeaderContent :bannerConf="bannerConf" :readonly="true" />
      <div class="content">
        <MainTitle :bannerConf="bannerConf" :readonly="true"></MainTitle>
        <MainRenderer ref="mainRef"></MainRenderer>
        <SubmitButton
          :validate="validate"
          :submitConf="submitConf"
          :readonly="true"
          :renderData="renderData"
          @submit="handleSubmit"
        ></SubmitButton>
        <LogoIcon :logo-conf="logoConf" :readonly="true" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/render/stores'
import { useRouter } from 'vue-router'
// @ts-ignore
import communalLoader from '@materials/communals/communalLoader.js'
import MainRenderer from '../components/MainRenderer.vue'
import AlertDialog from '../components/AlertDialog.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import ProgressBar from '../components/ProgressBar.vue'

import { submitForm } from '../api/survey'
import encrypt from '../utils/encrypt'

import useCommandComponent from '../hooks/useCommandComponent'

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

const store = useStore()
const { renderData, surveyPath, enterTime, encryptInfo } = storeToRefs(store)
const { state } = store
const router = useRouter()

const bannerConf = computed(() => state.bannerConf || {})
const submitConf = computed(() => state.submitConf || {})
const logoConf = computed(() => state.bottomConf || {})

const validate = (cbk: (v: boolean) => void) => {
  const index = 0
  mainRef.value.$refs.formGroup[index].validate(cbk)
}

const normalizationRequestBody = () => {
  const formValues = state.formValues

  const result: any = {
    surveyPath: surveyPath.value,
    data: JSON.stringify(formValues),
    difTime: Date.now() - enterTime.value,
    clientTime: Date.now()
  }

  if (encryptInfo.value?.encryptType) {
    result.encryptType = encryptInfo.value?.encryptType
    result.data = encrypt[result.encryptType as 'rsa']({
      data: result.data,
      secretKey: encryptInfo.value?.data?.secretKey
    })
    if (encryptInfo.value?.data?.sessionId) {
      result.sessionId = encryptInfo.value.data.sessionId
    }
  } else {
    result.data = JSON.stringify(result.data)
  }

  return result
}

const submitSurver = async () => {
  if (surveyPath.value.length > 8) {
    router.push({ name: 'successPage' })
    return
  }
  try {
    const params = normalizationRequestBody()
    console.log(params)
    const res: any = await submitForm(params)
    if (res.code === 200) {
      router.push({ name: 'successPage' })
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
  const confirmAgain = (state.submitConf as any)?.confirmAgain
  const { again_text, is_again } = confirmAgain

  if (is_again) {
    confirm({
      title: again_text,
      onConfirm: async () => {
        try {
          submitSurver()
        } catch (error) {
          console.log(error)
        } finally {
          confirm.close()
        }
      }
    })
  } else {
    submitSurver()
  }
}
</script>
<style scoped lang="scss">
.index {
  min-height: 100%;

  .wrapper {
    min-height: 100%;
    background-color: var(--primary-background-color);
    display: flex;
    flex-direction: column;

    .content {
      flex: 1;
      margin: 0 0.3rem;
      background: rgba(255, 255, 255, var(--opacity));
      border-radius: 8px 8px 0 0;
      height: 100%;
    }
  }
}
</style>
