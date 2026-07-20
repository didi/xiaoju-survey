<template>
  <div class="mask" v-if="visible">
    <div class="box">
      <div class="message">{{ message }}</div>
      <div class="btn btn-dark btn-base" @click="handleClose">我知道了</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { AnswerTimeUnit } from '../types/answerTimeLimit'

interface Props {
  visible?: boolean
  /** B 端配置的 answerMinDuration.duration */
  duration: number
  unit: AnswerTimeUnit
}

interface Emit {
  (ev: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

const emit = defineEmits<Emit>()

const message = computed(() => {
  const unitLabel = props.unit === 'second' ? '秒' : '分钟'
  return `答题时间不足 ${props.duration} ${unitLabel}，无法提交，请稍后再试！`
})

const handleClose = () => {
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

.message {
  font-size: 0.28rem;
  color: #4a4c5b;
  font-weight: 500;
  line-height: 1.6;
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
}

.btn-base {
  margin-top: 0.4rem;
}
</style>
