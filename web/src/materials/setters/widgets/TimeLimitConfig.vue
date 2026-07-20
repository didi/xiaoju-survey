<template>
  <div class="time-limit-config">
    <div class="row">
      <el-switch v-model="enabled" @change="handleEnabledChange" />
      <template v-if="enabled">
        <el-input-number
          class="duration-input"
          :class="{ 'is-error': !!errorMsg }"
          v-model="duration"
          :controls="false"
          :min="1"
          :max="unit === 'minute' ? maxMinute : undefined"
          :step="1"
          :precision="0"
          placeholder="请输入"
          @blur="handleDurationBlur"
        />
        <el-select class="unit-select" v-model="unit" @change="handleUnitChange">
          <el-option label="分" value="minute" />
          <el-option label="秒" value="second" />
        </el-select>
      </template>
    </div>
    <div v-if="enabled && errorMsg" class="error-tip">{{ errorMsg }}</div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

type Unit = 'minute' | 'second'

interface TimeLimitValue {
  enabled: boolean
  duration: number
  unit: Unit
}

interface FormConfig {
  key: string
  value?: TimeLimitValue
  defaultDuration?: number
}

interface Props {
  formConfig: FormConfig
  moduleConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: TimeLimitValue }): void
}

const DEFAULT_DURATION = 30
const MAX_MINUTE = 1440
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const maxMinute = MAX_MINUTE

// 回退值优先取 setter 声明的 defaultDuration（answerMinDuration=10 / answerTimeLimit=30），缺省回退 30
const fallbackDuration = computed<number>(() =>
  typeof props.formConfig.defaultDuration === 'number' && props.formConfig.defaultDuration > 0
    ? Math.floor(props.formConfig.defaultDuration)
    : DEFAULT_DURATION
)

const normalizeUnit = (u: any): Unit => (u === 'second' ? 'second' : 'minute')

const seedFromValue = (v: TimeLimitValue | undefined): TimeLimitValue => {
  const base: TimeLimitValue = {
    enabled: false,
    duration: fallbackDuration.value,
    unit: 'minute'
  }
  if (!v || typeof v !== 'object') return base
  return {
    enabled: !!v.enabled,
    duration:
      typeof v.duration === 'number' && Number.isFinite(v.duration) && v.duration > 0
        ? Math.floor(v.duration)
        : fallbackDuration.value,
    unit: normalizeUnit(v.unit)
  }
}

const initial = seedFromValue(props.formConfig.value)
const enabled = ref<boolean>(initial.enabled)
// duration 允许空态（null）：用户清空输入框时为非法态，阻断写库等待重新输入
const duration = ref<number | null>(initial.duration)
const unit = ref<Unit>(initial.unit)
const errorMsg = ref<string>('')


const commit = () => {
  errorMsg.value = ''
  emit(FORM_CHANGE_EVENT_KEY, {
    key: props.formConfig.key,
    value: {
      enabled: enabled.value,
      duration: duration.value as number,
      unit: unit.value
    }
  })
}

const handleEnabledChange = () => {
  if (!enabled.value) {
    errorMsg.value = ''
    emit(FORM_CHANGE_EVENT_KEY, {
      key: props.formConfig.key,
      value: {
        enabled: false,
        duration: (duration.value as number) || fallbackDuration.value,
        unit: unit.value
      }
    })
    return
  }
  commit()
}

const handleDurationBlur = () => {
  commit()
}

const handleUnitChange = (next: Unit) => {
  unit.value = next
  commit()
}

// 当父 schema 外部变化（如远端拉到的回显）时同步本地
watch(
  () => props.formConfig.value,
  (newVal) => {
    const seeded = seedFromValue(newVal)
    if (
      seeded.enabled !== enabled.value ||
      seeded.duration !== duration.value ||
      seeded.unit !== unit.value
    ) {
      enabled.value = seeded.enabled
      duration.value = seeded.duration
      unit.value = seeded.unit
      errorMsg.value = ''
    }
  },
  { deep: true }
)

const displayUnitLabel = computed(() => (unit.value === 'second' ? '秒' : '分'))
defineExpose({ displayUnitLabel, errorMsg })
</script>
<style lang="scss" scoped>
.time-limit-config {
  display: flex;
  flex-direction: column;

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .duration-input {
    width: 110px;

    &.is-error :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px var(--el-color-danger) inset;
    }
  }

  .unit-select {
    width: 80px;
  }

  .error-tip {
    margin-top: 4px;
    color: var(--el-color-danger, #f56c6c);
    font-size: 12px;
    line-height: 1.4;
  }
}
</style>
