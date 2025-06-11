<template>
  <div class="option-edit-bar-wrap">
    <div class="option-edit-bar">
      <div v-if="showOthers" class="add-option primary-color" @click="addOther">
        <extra-icon type="add-square"></extra-icon>
        其他____
      </div>
      <!-- 预留：作为左侧内容的扩展 -->
      <!-- <span class="extra-config"><component :is="slots.extraEdit" /></span> -->
      <span v-if="showAdvancedConfig && !!slots.advancedEdit" class="advanced-config">
        <component :is="slots.advancedEdit" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import ExtraIcon from '../ExtraIcon/index.vue'

defineProps({
  optionList: {
    type: Array,
    default: () => []
  },
  showOthers: {
    type: Boolean,
    default: true
  },
  showAdvancedConfig: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['addOther', 'optionChange', 'change'])

const slots = inject('slots')

const addOther = () => {
  emit('addOther')
}
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
    cursor: pointer;
    margin-right: 10px;
    font-size: 12px;
  }

  .advanced-config {
    float: right;
    cursor: pointer;
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
