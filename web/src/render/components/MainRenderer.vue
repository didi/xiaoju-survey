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
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

import MaterialGroup from './MaterialGroup.vue'
import { useQuestionStore } from '../stores/question'
import { useSurveyStore } from '../stores/survey'

const surveyStore = useSurveyStore()
const questionStore = useQuestionStore()
const { renderData, needHideFields, showLogicHideFields } = storeToRefs(questionStore)


const { rules, formValues } = storeToRefs(surveyStore)

const handleChangeData = (data: any) => {
  surveyStore.changeData(data)
}

// 在适当的地方调用 updatePageIndex 方法
watch(() => renderData.value, (value: any) => {
  if(value.length ){
  const displaylist = value[0].filter((item: any) => !needHideFields.value.includes(item.field))
  if(displaylist.length === 0){
    questionStore.addPageIndex()
  }
  }
})
watch(() => { return needHideFields.value.concat(showLogicHideFields.value) }, (value: any)=> {
  if(renderData.value.length ){
    const displaylist = renderData.value[0].filter((item: any) => !value.includes(item.field))
    if(displaylist.length === 0){
      questionStore.addPageIndex()
    }
  }
}, {
  deep: true
})
</script>
