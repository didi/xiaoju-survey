<template>
  <div class="result-page-wrap">
    <div class="result-page">
      <div class="page-content">
        <img class="img" src="/imgs/icons/error.webp" />
        <div class="msg">该问卷已被删除，无法继续访问</div>
        <el-button type="primary" @click="backToList" class="back-btn">返回问卷列表</el-button>
      </div>
      <LogoIcon :logo-conf="logoConf" :readonly="true" />
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import communalLoader from '@materials/communals/communalLoader.js'
import { useSurveyStore } from '../stores/survey'

const LogoIcon = communalLoader.loadComponent('LogoIcon')
const surveyStore = useSurveyStore()
const router = useRouter()

const logoConf = computed(() => surveyStore.bottomConf || {})

// 返回问卷列表
const backToList = () => {
  window.location.href = '/management'
}
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
  display: flex;
  flex-direction: column;
  align-items: center;

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
    margin-bottom: 0.3rem;
  }
  
  .back-btn {
    margin-top: 0.3rem;
  }
}
</style> 