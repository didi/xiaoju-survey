<template>
  <div class="main">
    <template v-for="(item, index) in renderData" :key="index">
      <MaterialGroup
        ref="formGroup"
        :render-data="item"
        :rules="rules"
        :formValues="formValues"
        @formChange="handleChangeData"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import MaterialGroup from './MaterialGroup.vue'
import { useQuestionStore } from '../stores/question'
import { useSurveyStore } from '../stores/survey'

const surveyStore = useSurveyStore()
const questionStore = useQuestionStore()

const renderData = computed(() => questionStore.renderData)

const { rules, formValues } = storeToRefs(surveyStore)

const handleChangeData = (data: any) => {
  surveyStore.changeData(data)
}
</script>
