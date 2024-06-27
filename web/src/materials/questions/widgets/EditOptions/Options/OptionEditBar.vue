<template>
  <!-- const { showOthers, hasAdvancedConfig, hasAdvancedRateConfig, min, max, explain, isNps } = this -->
  <div class="option-edit-bar-wrap">
    <div class="option-edit-bar">
      <div v-if="showOthers" class="add-option primary-color" @click="addOther">
        <extra-icon type="add-square"></extra-icon>
        其他____
      </div>

      <span
        v-if="hasAdvancedConfig"
        class="option-advanced-config primary-color"
        @click="openOptionConfig"
      >
        高级设置>
      </span>

      <span
        v-if="hasAdvancedRateConfig"
        class="option-advanced-config primary-color"
        @click="openRateConfig"
      >
        高级评分设置>
      </span>
    </div>

    <OptionConfig
      :options="optionList"
      :showOptionDialog="optionConfigVisible"
      :showOthers="showOthers"
      :showLimit="false"
      v-model="optionConfigVisible"
      @addOther="addOther"
      @optionChange="handleOptionChange"
      @change="handleChange"
    />

    <RateConfig
      :class="isNps ? 'nps-rate-config' : ''"
      dialogWidth="800px"
      :min="min"
      :max="max"
      :rangeConfig="moduleConfig.rangeConfig"
      v-model="rateConfigVisible"
      :explain="explain"
      @confirm="handleChange"
      @visibleChange="onVisibleChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import OptionConfig from '../AdvancedConfig/OptionConfig.vue'
import RateConfig from '../AdvancedConfig/RateConfig.vue'
import ExtraIcon from '../ExtraIcon/index.vue'
import { QUESTION_TYPE } from '@/common/typeEnum'

defineProps({
  optionList: {
    type: Array,
    default: () => []
  },
  showOthers: {
    type: Boolean,
    default: true
  },
  hasAdvancedConfig: {
    type: Boolean,
    default: true
  },
  hasAdvancedRateConfig: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['addOther', 'optionChange', 'change'])

const moduleConfig = inject('moduleConfig')
const optionConfigVisible = ref(false)
const openOptionConfig = () => {
  optionConfigVisible.value = true
}

const addOther = () => {
  emit('addOther')
}
const handleOptionChange = (value) => {
  emit('optionChange', value)
}
const handleChange = (data) => {
  emit('change', data)
}

const rateConfigVisible = ref(false)
const openRateConfig = () => {
  rateConfigVisible.value = true
}
const onVisibleChange = (val) => {
  rateConfigVisible.value = val
}

const isNps = computed(() => {
  return moduleConfig.value.type === QUESTION_TYPE.RADIO_NPS
})

const min = computed(() => {
  const { min, starMin } = moduleConfig.value
  return isNps.value ? min : starMin
})

const max = computed(() => {
  const { max, starMax } = moduleConfig.value
  return isNps.value ? max : starMax
})

const explain = computed(() => {
  const { type } = moduleConfig.value
  if (type == 'radio-start') return true
  if (isNps.value) return false
  return true
})
</script>

<style lang="scss" scoped>
.option-edit-bar-wrap {
  margin-top: 20px;
  padding-left: 10px;
  position: relative;
  line-height: 24px;
  font-size: 12px;
  color: $primary-color;

  .add-option {
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    font-size: 12px;
  }

  .option-advanced-config {
    color: #0f8a82;
    float: right;
    cursor: pointer;
    font-size: 12px;
  }

  .primary-color {
    color: $primary-color;
  }
}

.nps-rate-config {
  :deep(.row) {
    height: 47px;
  }
  :deep(.text) {
    input {
      height: 32px;
    }
  }
}
</style>
