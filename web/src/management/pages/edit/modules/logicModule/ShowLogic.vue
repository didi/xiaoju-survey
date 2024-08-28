<template>
  <div class="logic-wrapper">
    <RulePanel></RulePanel>
  </div>
</template>
<script setup lang="ts">
import { computed, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import { cloneDeep } from 'lodash-es'

import RulePanel from './components/RulePanel.vue'
import { filterQuestionPreviewData } from '@/management/utils/index'

const editStore = useEditStore()
const { questionDataList } = storeToRefs(editStore)

const renderData = computed(() => {
  return filterQuestionPreviewData(cloneDeep(questionDataList.value))
})

provide('renderData', renderData)
</script>
<style lang="scss" scoped>
.logic-wrapper {
  height: 100%;
  width: 100%;
  background: #fff;
  text-align: center;
  overflow: auto;
  // position: fixed;
}
</style>
