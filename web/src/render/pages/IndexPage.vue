<template>
  <div class="index">
    <progressBar />
    <div class="wrapper" ref="boxRef">
      <HeaderContent :bannerConf="" />
      <div class="content">
        <MainTitle></MainTitle>
        <MainRenderer ref="mainRef"></MainRenderer>
        <submit :validate="validate" :renderData="renderData" @submit="handleSubmit"></submit>
        <LogoIcon />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import HeaderSetter from '../components/HeaderSetter.vue'
import HeaderContent from '@materials/communals/widgets/HeaderContent/index.jsx'
import MainTitle from '../components/MainTitle.vue'
import submit from '../components/SubmitSetter.vue'
import MainRenderer from '../components/MainRenderer.vue'
import AlertDialog from '../components/AlertDialog.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import progressBar from '../components/ProgressBar.vue'
import LogoIcon from '../components/LogoIcon.vue'

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

const mainRef = ref<any>()
const boxRef = ref<HTMLElement>()

const alert = useCommandComponent(AlertDialog)
const confirm = useCommandComponent(ConfirmDialog)

const store = useStore()

const renderData = computed(() => store.getters.renderData)

const validate = (cbk: (v: boolean) => void) => {
  const index = 0
  mainRef.value.$refs.formGroup[index].validate(cbk)
}

const normalizationRequestBody = () => {
  const enterTime = store.state.enterTime
  const encryptInfo = store.state.encryptInfo
  const formModel = store.getters.formModel
  const surveyPath = store.state.surveyPath

  const result: any = {
    surveyPath,
    data: JSON.stringify(formModel),
    difTime: Date.now() - enterTime,
    clientTime: Date.now()
  }

  if (encryptInfo?.encryptType) {
    result.encryptType = encryptInfo?.encryptType
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

const submitSurver = async () => {
  try {
    const params = normalizationRequestBody()
    console.log(params)
    const res: any = await submitForm(params)
    if (res.code === 200) {
      store.commit('setRouter', 'successPage')
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
  const confirmAgain = store.state.submitConf.confirmAgain
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
