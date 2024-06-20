<template>
  <div class="text-select-root">
    <el-select v-model="selectValue" :empty-values="[null, undefined]" :placeholder="options.label">
      <el-option
        v-for="item in options.value"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  options: {
    type: Object,
    required: true
  }
})
const emit = defineEmits('change')
const selectValue = computed({
  get() {
    return props.value
  },
  set(val) {
    emit('change', val)
  }
})
</script>

<style lang="scss" scoped>
.el-select {
  width: 105px;
  line-height: 35px;
  margin-right: 20px;
  :deep(.el-select__wrapper) {
    box-shadow: none;
    height: 35px;
    //   line-height: 35px;
  }
  :deep(.el-icon-arrow-up:before) {
    position: relative;
    top: -2px;
  }
}
</style>
