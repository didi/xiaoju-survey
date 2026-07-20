<template>
  <div class="mask" v-if="visible">
    <div class="box">
      <div class="title">提示</div>
      <div class="content">{{ message }}</div>
      <div class="btn btn-dark btn-base" @click="handleStart">开始填写</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { AnswerTimeUnit } from '../types/answerTimeLimit'

interface Props {
  visible?: boolean
  /** B 端配置的总限时（duration） */
  duration: number
  /** 单位：分 / 秒 */
  unit: AnswerTimeUnit
  /** 剩余答题时长（ms） */
  remainingMs: number
}

interface Emit {
  (ev: 'start'): void
  (ev: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

const emit = defineEmits<Emit>()

const unitLabel = computed(() => (props.unit === 'second' ? '秒' : '分钟'))

const totalMs = computed(() =>
  props.unit === 'second' ? props.duration * 1000 : props.duration * 60 * 1000
)

const message = computed(() => {
  const Y = props.duration
  const remaining = props.remainingMs
  // 首次进入：剩余等于总时长（或 ≥ 总时长）
  if (remaining >= totalMs.value) {
    return `本次问卷填写限时 ${Y} ${unitLabel.value}，开始填写后计时，超时将自动提交`
  }
  if (props.unit === 'minute') {
    if (remaining < 60 * 1000) {
      return `本次问卷填写限时 ${Y} 分钟，本次剩余答题时长不足 1 分钟，开始填写后计时，超时将自动提交`
    }
    const remainingMinutes = Math.floor(remaining / 60000)
    return `本次问卷填写限时 ${Y} 分钟，本次剩余答题时长 ${remainingMinutes} 分钟，开始填写后计时，超时将自动提交`
  }
  // unit === 'second' — 无「不足 1 秒」分支（CL-015）
  const remainingSeconds = Math.max(0, Math.floor(remaining / 1000))
  return `本次问卷填写限时 ${Y} 秒，本次剩余答题时长 ${remainingSeconds} 秒，开始填写后计时，超时将自动提交`
})

const handleStart = () => {
  emit('start')
  emit('close')
}
</script>
<style lang="scss" scoped>
@import url('../styles/dialog.scss');

.mask {
  z-index: 1000;
}

.btn-dark {
  background: #4a4c5b;
  color: #fff;
}

.content {
  font-size: 0.26rem;
  color: #606266;
  line-height: 1.6;
  text-align: center;
  margin: 0.32rem 0 0.4rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.btn-base {
  margin-top: 0.4rem;
}
</style>
