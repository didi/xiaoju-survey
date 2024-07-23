<template>
  <div class="result-page-wrap">
    <div class="result-page">
      <div class="page-content">
        <img class="img" :src="errorImage" />
        <div class="msg" v-html="errorMsg"></div>
      </div>
      <LogoIcon :logo-conf="logoConf" :readonly="true" />
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import communalLoader from '@materials/communals/communalLoader.js'
import { useErrorInfo } from '../stores/errorInfo'
import { useSurveyStore } from '../stores/survey'

const LogoIcon = communalLoader.loadComponent('LogoIcon')

const surveyStore = useSurveyStore()
const errorStore = useErrorInfo()
const { errorInfo } = storeToRefs(errorStore)
const imageMap = {
  overTime: '/imgs/icons/overtime.webp',
  default: '/imgs/icons/error.webp'
}

const errorImage = computed(() => {
  const errorType = errorInfo.value.errorType

  return imageMap[errorType] || imageMap.default
})

const errorMsg = computed(() => {
  return errorInfo.value.errorMsg || '提交失败'
})
const logoConf = computed(() => surveyStore.bottomConf || {})
</script>
<style lang="scss" scoped>
.result-page-wrap {
  width: 100%;
  flex: 1;
  text-align: center;
  overflow: hidden;
  background: var(--primary-background-color);

  padding: 0 0.3rem;
  .result-page {
    background: rgba(255, 255, 255, var(--opacity));
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}
.page-content {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  position: relative;
  padding-top: 2rem;
  flex: 1;

  .img {
    width: 2rem;
  }

  .msg {
    font-size: 0.32rem;
    color: #4a4c5b;
    letter-spacing: 0;
    text-align: center;
    font-weight: 500;
    margin-top: 0.15rem;
  }
}
</style>
