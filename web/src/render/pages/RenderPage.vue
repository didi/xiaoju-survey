<template>
  <div class="index">
    <ProgressBar />
    <CountdownHeader
      v-if="answerTimeLimit?.enabled"
      :duration="answerTimeLimit.duration"
      :unit="answerTimeLimit.unit"
      :started-at="startedAt"
      :initial-remaining-ms="initialRemainingMs"
      :active="answeringStarted"
      @expire="handleExpire"
      @tick="handleTick"
    />
    <AnswerTimeLimitDialog
      v-if="answerTimeLimit?.enabled"
      :visible="entryDialogVisible"
      :duration="answerTimeLimit.duration"
      :unit="answerTimeLimit.unit"
      :remaining-ms="initialRemainingMs"
      @start="handleStartAnswering"
      @close="entryDialogVisible = false"
    />
    <MinDurationDialog
      v-if="effectiveAnswerMinDuration?.enabled"
      :visible="minDurationDialogVisible"
      :duration="effectiveAnswerMinDuration.duration"
      :unit="effectiveAnswerMinDuration.unit"
      @close="minDurationDialogVisible = false"
    />
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
import AnswerTimeLimitDialog from '../components/AnswerTimeLimitDialog.vue'
import CountdownHeader from '../components/CountdownHeader.vue'
import MinDurationDialog from '../components/MinDurationDialog.vue'

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
import {
  read as readAnswerTime,
  write as writeAnswerTime,
  clear as clearAnswerTime,
  init as initAnswerTime
} from '../utils/answerTimeStore'
import {
  type AnswerTimeLimitConf,
  getEffectiveAnswerMinDuration,
  normalizeUnit,
  unitToMs
} from '../types/answerTimeLimit'

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
const {
  bannerConf,
  submitConf,
  bottomConf: logoConf,
  whiteData,
  baseConf
} = storeToRefs(surveyStore)
const surveyPath = computed(() => surveyStore.surveyPath || '')

// === 答题限时 / 最短答题时长 ===
const normalizeConf = (raw: any): AnswerTimeLimitConf | null => {
  if (!raw || typeof raw !== 'object' || raw.enabled !== true) return null
  const duration = typeof raw.duration === 'number' && raw.duration > 0 ? raw.duration : 30
  return {
    enabled: true,
    duration,
    unit: normalizeUnit(raw.unit)
  }
}

const answerTimeLimit = computed<AnswerTimeLimitConf | null>(() =>
  normalizeConf((baseConf.value as any)?.answerTimeLimit)
)
const answerMinDuration = computed<AnswerTimeLimitConf | null>(() =>
  normalizeConf((baseConf.value as any)?.answerMinDuration)
)
const effectiveAnswerMinDuration = computed<AnswerTimeLimitConf | null>(() =>
  getEffectiveAnswerMinDuration(answerMinDuration.value, answerTimeLimit.value)
)

const entryDialogVisible = ref(false)
const minDurationDialogVisible = ref(false)
const answeringStarted = ref(false)
const startedAt = ref(0)
const initialRemainingMs = ref(0)
let lastKnownRemainingMs = 0
const persistTimer = ref<number | null>(null)
const submitting = ref(false)

const persistRemaining = () => {
  const conf = answerTimeLimit.value
  if (!conf || !surveyPath.value || startedAt.value <= 0) return
  // 优先用倒计时的 tick 值；未收到时按 (initialRemainingMs - elapsed) 兜底
  const elapsed = Math.max(0, Date.now() - startedAt.value)
  const remaining =
    lastKnownRemainingMs > 0
      ? lastKnownRemainingMs
      : Math.max(0, initialRemainingMs.value - elapsed)
  writeAnswerTime({
    surveyPath: surveyPath.value,
    remainingMs: remaining,
    startedAt: startedAt.value,
    duration: conf.duration,
    unit: conf.unit,
    updatedAt: Date.now()
  })
}

const initAnswerTimeOnMount = () => {
  const conf = answerTimeLimit.value
  if (!conf || !surveyPath.value) return
  const existing = readAnswerTime(surveyPath.value)
  if (existing && existing.duration === conf.duration && existing.unit === conf.unit) {
    initialRemainingMs.value = Math.max(0, existing.remainingMs)
  } else {
    initialRemainingMs.value = unitToMs(conf.duration, conf.unit)
    initAnswerTime(surveyPath.value, conf)
  }
  lastKnownRemainingMs = initialRemainingMs.value
  // 启用时一律先弹「开始填写」入口（即使剩余 0 也展示，让用户知道）
  entryDialogVisible.value = true
  answeringStarted.value = false
}

const handleStartAnswering = () => {
  const conf = answerTimeLimit.value
  if (!conf || !surveyPath.value) return
  startedAt.value = Date.now()
  answeringStarted.value = true
  writeAnswerTime({
    surveyPath: surveyPath.value,
    remainingMs: initialRemainingMs.value,
    startedAt: startedAt.value,
    duration: conf.duration,
    unit: conf.unit,
    updatedAt: Date.now()
  })
  // 立即重新计算 surveyStore.enterTime，使「最短时长」校验从「点击开始填写」起算
  surveyStore.setEnterTime?.()
}

const handleTick = (remainingMs: number) => {
  lastKnownRemainingMs = remainingMs
  // 5s 间隔写回 localStorage
  if (!persistTimer.value && answerTimeLimit.value?.enabled && answeringStarted.value) {
    persistTimer.value = window.setInterval(persistRemaining, 5000)
  }
}

const handleVisibilityHidden = () => {
  if (document.visibilityState === 'hidden') {
    persistRemaining()
  }
}

const handleBeforeUnload = () => {
  persistRemaining()
}

// === 提交流程 ===
const validate = (callback: (v: boolean) => void) => {
  const index = 0
  mainRef.value.$refs.formGroup[index].validate(callback)
}

const buildRequestBody = (autoSubmit: boolean) => {
  const enterTime = surveyStore.enterTime
  const encryptInfo: any = surveyStore.encryptInfo
  const formValues = surveyStore.formValues
  const localBaseConf: any = surveyStore.baseConf

  const result: any = {
    surveyPath: surveyPath.value,
    data: JSON.stringify(formValues),
    diffTime: Date.now() - enterTime,
    clientTime: Date.now(),
    ...whiteData.value
  }

  if (autoSubmit) {
    result.autoSubmit = true
  }

  // 自动回填开启时，记录数据（autoSubmit 场景仍然记录用户已填内容）
  if (localBaseConf.fillSubmitAnswer) {
    clearSurveyData(surveyPath.value)
    clearSurveySubmit(surveyPath.value)
    setSurveyData(surveyPath.value, formValues)
    setSurveySubmit(surveyPath.value, 1)
  }

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

const checkMinDuration = (): boolean => {
  const conf = effectiveAnswerMinDuration.value
  if (!conf) return true
  const minMs = unitToMs(conf.duration, conf.unit)
  // 最短时长以「点击开始填写」时刻起算（若未启用 answerTimeLimit 则退回到 enterTime）
  const baseTs = startedAt.value > 0 ? startedAt.value : surveyStore.enterTime
  const elapsed = Math.max(0, Date.now() - baseTs)
  if (elapsed < minMs) {
    minDurationDialogVisible.value = true
    return false
  }
  return true
}

const submitSurvey = async (autoSubmit = false) => {
  if (submitting.value) return
  if (surveyPath.value.length > 8) {
    if (autoSubmit) {
      // 预览态不真正提交，但仍清掉 localStorage 并跳转
      clearAnswerTime(surveyPath.value)
    }
    router.push({ name: 'successPage' })
    return
  }
  submitting.value = true
  try {
    const params = buildRequestBody(autoSubmit)
    const res: any = await submitForm(params)
    if (res.code === 200) {
      clearAnswerTime(surveyPath.value)
      router.replace({ name: 'successPage' })
    } else {
      alert({ title: res.errmsg || '提交失败' })
      if (res.code === 9003 && res.data) {
        surveyStore.changeData({ key: res.data.field, value: null })
        questionStore.initOptionCountInfo()
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    submitting.value = false
  }
}

const handleSubmit = () => {
  const confirmAgain = (surveyStore.submitConf as any).confirmAgain
  const { again_text, is_again } = confirmAgain
  if (!isFinallyPage.value) {
    questionStore.addPageIndex()
    return
  }
  // 必填校验已在 SubmitButton.submit 中通过 validate 完成
  // 这里追加最短时长校验
  if (!checkMinDuration()) return
  if (is_again) {
    confirm({
      title: again_text,
      onConfirm: async () => {
        try {
          await submitSurvey(false)
        } catch (error) {
          console.log(error)
        } finally {
          confirm.close()
        }
      }
    })
  } else {
    submitSurvey(false)
  }
}

const handleExpire = () => {
  if (submitting.value) return
  // 倒计时归零：跳过 FE 必填 + 最短时长校验，直接提交 autoSubmit=true
  submitSurvey(true)
}

watch(
  () => answerTimeLimit.value?.enabled,
  (enabled) => {
    if (enabled) {
      initAnswerTimeOnMount()
    } else {
      entryDialogVisible.value = false
      answeringStarted.value = false
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  document.addEventListener('visibilitychange', handleVisibilityHidden)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('visibilitychange', handleVisibilityHidden)
  if (persistTimer.value != null) {
    window.clearInterval(persistTimer.value)
    persistTimer.value = null
  }
})
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
