<template>
  <div class="btn" @click="onCooper">
    <i-ep-connection class="view-icon" :size="20" />
    <span class="btn-txt">协作</span>
  </div>
  <CooperModify :modifyId="cooperId" :visible="cooperModify" @on-close-codify="onCooperClose" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import 'element-plus/theme-chalk/src/message.scss'

import CooperModify from '@/management/components/CooperModify/ModifyDialog.vue'

defineSlots<{
  content: (scope: { onCooper: () => void }) => any
}>()

const route = useRoute()
const surveyId = route.params?.id as string
const cooperModify = ref<boolean>(false)
const cooperId = ref<string>('')

const onCooper = (): void => {
  cooperId.value = surveyId
  cooperModify.value = true
}

const onCooperClose = (): void => {
  cooperModify.value = false
}
</script>
<style lang="scss" scoped>
@import url('@/management/styles/edit-btn.scss');
</style>
