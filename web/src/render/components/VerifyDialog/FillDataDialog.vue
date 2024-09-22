<template>
  <ConfirmDialog
    :title="fillAnswer ? '是否继续上次填写的内容？' : '是否继续上次提交的内容？'"
    @confirm="handleSubmit"
  />
</template>
<script setup>
import { useSurveyStore } from '../../stores/survey'

import { getSurveyData } from '../../utils/storage'

import ConfirmDialog from '../ConfirmDialog.vue'

const surveyStore = useSurveyStore()
const { fillAnswer } = surveyStore.baseConf || {}

const handleSubmit = () => {
  const surveyPath = surveyStore.surveyPath
  const data = getSurveyData(surveyPath)
  surveyStore.setFormValues(data)
}
</script>
<style lang="scss" scoped></style>
