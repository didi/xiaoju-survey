<template>
  <div v-if="active" class="countdown-header" :class="{ 'is-warn': remainingSec <= warnThreshold }">
    {{ display }}
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AnswerTimeUnit } from '../types/answerTimeLimit'

interface Props {
  /** 总时长（duration） */
  duration: number
  unit: AnswerTimeUnit
  /** 起算时间戳（Date.now() 时刻），0 表示未开始 */
  startedAt: number
  /** 起算时已剩余的毫秒数（用于断点续答） */
  initialRemainingMs: number
  /** 是否激活（answerTimeLimit.enabled && 已开始填写） */
  active?: boolean
}

interface Emit {
  (ev: 'expire'): void
  (ev: 'tick', remainingMs: number): void
}

const props = withDefaults(defineProps<Props>(), {
  active: false
})

const emit = defineEmits<Emit>()

const now = ref(Date.now())
let timer: number | null = null

const elapsed = computed(() => Math.max(0, now.value - props.startedAt))
const remainingMs = computed(() => Math.max(0, props.initialRemainingMs - elapsed.value))
const remainingSec = computed(() => Math.ceil(remainingMs.value / 1000))

const warnThreshold = 30

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`)

const display = computed(() => {
  if (!props.active) return ''
  const ms = remainingMs.value
  if (props.unit === 'second') {
    const s = Math.max(0, Math.ceil(ms / 1000))
    return `倒计时 ${s}`
  }
  // 分钟模式：mm:ss；≥100 分钟时使用 3 位分钟
  const totalSec = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec - minutes * 60
  const mm = minutes >= 100 ? String(minutes) : pad2(minutes)
  return `倒计时 ${mm}:${pad2(seconds)}`
})

const stopTimer = () => {
  if (timer != null) {
    window.clearInterval(timer)
    timer = null
  }
}

const tick = () => {
  now.value = Date.now()
  emit('tick', remainingMs.value)
  if (remainingMs.value <= 0) {
    stopTimer()
    emit('expire')
  }
}

const startTimer = () => {
  stopTimer()
  if (!props.active || props.startedAt <= 0) return
  now.value = Date.now()
  if (remainingMs.value <= 0) {
    emit('expire')
    return
  }
  timer = window.setInterval(tick, 1000)
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    now.value = Date.now()
    if (props.active && remainingMs.value <= 0) {
      stopTimer()
      emit('expire')
    }
  }
}

watch(
  () => [props.active, props.startedAt],
  () => {
    startTimer()
  }
)

onMounted(() => {
  startTimer()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  stopTimer()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

defineExpose({ remainingMs })
</script>
<style lang="scss" scoped>
.countdown-header {
  position: fixed;
  top: 0.16rem;
  right: 0.2rem;
  z-index: 10;
  padding: 0.08rem 0.24rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 0.26rem;
  line-height: 1.4;
  letter-spacing: 0.02rem;
  font-variant-numeric: tabular-nums;
  pointer-events: none;

  &.is-warn {
    background: #f56c6c;
  }
}
</style>
