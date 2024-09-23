<template>
  <div class="result-page-wrap">
    <div class="result-page">
      <div class="result-content">
        <img src="/imgs/icons/success.webp" />
        <div class="msg" v-html="successMsg"></div>
        <router-link
          :to="{
            name: 'renderPage',
            query: {
              t: new Date().getTime()
            }
          }"
          replace
          class="reset-link"
        >
          重新填写
        </router-link>
      </div>
      <LogoIcon :logo-conf="logoConf" :readonly="true" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useSurveyStore } from '../stores/survey'
// @ts-ignore
import communalLoader from '@materials/communals/communalLoader.js'

const LogoIcon = communalLoader.loadComponent('LogoIcon')
const surveyStore = useSurveyStore()

const logoConf = computed(() => {
  return surveyStore?.bottomConf || {}
})
const successMsg = computed(() => {
  const msgContent = (surveyStore?.submitConf as any)?.msgContent || {}
  return msgContent?.msg_200 || '提交成功'
})
</script>
<style lang="scss" scoped>
@import '@/render/styles/variable.scss';

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

.result-content {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  position: relative;
  padding-top: 2rem;
  flex: 1;

  img {
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

  .reset-link {
    margin-top: 0.24rem;
    font-size: 0.27rem;
    color: #5094f0;
    text-decoration: underline;
    display: block;
  }
}
</style>
