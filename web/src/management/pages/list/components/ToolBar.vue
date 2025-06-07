<template>
  <div class="tool-bar-root" @click="handleClick">
    <template v-if="iconTools.length">
      <ToolModule
        v-for="t in iconTools"
        :key="t.key"
        :type="type"
        :value="t.key"
        :label="t.label"
        :width="t.width || toolWidth"
        :color="t.color"
        @call="onCall"
      />
      <MoreTool
        v-if="moreTools.length"
        :type="type"
        :width="toolWidth"
        :tools="moreTools"
        @call="onCall"
      ></MoreTool>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { slice } from 'lodash-es'
import ToolModule from './ToolModule.vue'
import MoreTool from './MoreTool.vue'
import { color } from 'echarts'

const props = defineProps({
  data: Object,
  type: String,
  toolWidth: Number,
  tools: Array
})
const emit = defineEmits(['click'])
const limit = 4
const iconTools = computed(() => {
  return slice(props.tools, 0, limit - 1)
})
const moreTools = computed(() => {
  return slice(props.tools, limit - 1)
})
const onCall = (val) => {
  emit('click', val.key, props.data)
}
const handleClick = (e) => {
  // 防止事件冒泡，触发父组件的点击事件
  e.preventDefault()
  e.stopPropagation()
}
</script>

<style lang="scss" scoped>
.tool-bar-root {
  margin-left: -16px;
  .tool-root:not(:last-child) {
    border-right: solid 1px $border-color;
  }
}
</style>
