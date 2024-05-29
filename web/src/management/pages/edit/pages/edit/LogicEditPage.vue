<template>
  <div class="logic-wrapper">
    <RulePanel></RulePanel>
  </div>
</template>
<script setup lang="ts">
import { computed, provide } from 'vue'
import { useStore } from 'vuex'
import { cloneDeep } from 'lodash-es'

import RulePanel from '../../modules/logicModule/RulePanel.vue'
import { filterQuestionPreviewData } from '@/management/utils/index'

const store = useStore()

const questionDataList = computed(() => {
  return store.state.edit.schema.questionDataList
})

const renderData = computed(() => {
  return filterQuestionPreviewData(cloneDeep(questionDataList.value))
})

provide('renderData', renderData)
</script>
<style lang="scss" scoped>
.logic-wrapper {
  height: calc(100% - 120px);
  width: 100%;
  margin: 12px;
  background: #fff;
  text-align: center;
  overflow: auto;
}
</style>
