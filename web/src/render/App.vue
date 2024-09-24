<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useSurveyStore } from './stores/survey'

const { skinConf } = storeToRefs(useSurveyStore())

watch(skinConf, (skinConfig) => {
  const root = document.documentElement
  const { themeConf, backgroundConf, contentConf }: any = skinConfig

  if (themeConf?.color) {
    // 设置主题颜色
    root.style.setProperty('--primary-color', themeConf?.color)
  }

  // 设置背景
  const { color, type, image } = backgroundConf || {}
  root.style.setProperty(
    '--primary-background',
    type === 'image' ? `url(${image}) no-repeat center / cover` : color
  )

  if (contentConf?.opacity.toString()) {
    // 设置全局透明度
    root.style.setProperty('--opacity', `${contentConf.opacity / 100}`)
  }
})
</script>
<style lang="scss">
@import url('./styles/icon.scss');
@import url('../materials/questions/common/css/icon.scss');
@import url('./styles/reset.scss');

html {
  background: #f7f7f7;
}

#app {
  position: relative;
  overflow-x: hidden;
  width: 100%;
  max-width: 750px;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #fff;
}

@media screen and (min-width: 750px) {
  body {
    padding-top: 40px;
    background: var(--primary-background);
  }
  #app {
    border-radius: 8px 8px 0 0;
    box-shadow: var(--el-box-shadow);
  }
}
</style>
