<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useSurveyStore } from './stores/survey'
import applySkinConfig from '@/common/utils/applySkinConfig';

const { skinConf } = storeToRefs(useSurveyStore())

watch(skinConf, (value) => {
  applySkinConfig(value)
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
