<template>
  <div class="result-page-wrap">
    <div class="result-page">
      <div class="page-content">
        <img class="img" :src="errorImageUrl" />
        <div class="msg" v-html="errorMsg"></div>
      </div>
      <LogoIcon :logo-conf="logoConf" :readonly="true" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
// @ts-ignore
import communalLoader from '@materials/communals/communalLoader.js'

const LogoIcon = communalLoader.loadComponent('LogoIcon')

const store = useStore()

const errorImageUrl = computed(() => {
  const errorType = store.state?.errorInfo?.errorType
  const imageMap = {
    overTime: '/imgs/icons/overtime.webp',
    default: '/imgs/icons/error.webp'
  }

  return imageMap[errorType as 'overTime'] || imageMap.default
})

const errorMsg = computed(() => store.state?.errorInfo?.errorMsg || '提交失败')
const logoConf = computed(() => store.state?.bottomConf || {})
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
