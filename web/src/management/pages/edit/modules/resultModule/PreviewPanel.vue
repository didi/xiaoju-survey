<template>
  <div class="result-config-preview">
    <div class="result-page-wrap">
      <div class="result-page">
        <component
          :is="components[currentEditStatus]"
          :key="currentEditStatus"
          :module-config="moduleConfig"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'

import SuccessContent from './components/SuccessContent.vue'
import OverTime from './components/OverTime.vue'
import { EDIT_STATUS_MAP } from './components/enum'

const components = {
  [EDIT_STATUS_MAP.SUCCESS]: SuccessContent,
  [EDIT_STATUS_MAP.OVERTIME]: OverTime
}

const editStore = useEditStore()
const { currentEditStatus } = storeToRefs(editStore)
const { schema } = editStore
const moduleConfig = toRef(schema, 'submitConf')
</script>
<style lang="scss" scoped>
.result-config-preview {
  width: 100%;
  height: 100%;
  min-width: 500px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--primary-background);
}

.result-page-wrap {
  width: 90%;
  margin-top: 50px;
  min-height: 812px;
  max-height: 812px;
  overflow-x: hidden;
  overflow-y: auto;
  .result-page {
    background: rgba(255, 255, 255, var(--opacity));
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}
</style>
