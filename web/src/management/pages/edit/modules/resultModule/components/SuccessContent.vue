<template>
  <div class="suc-page">
    <div class="suc-content">
      <div class="title-box">
        <img src="/imgs/icons/success.webp" class="success-img" />
        <div class="title-msg" v-safe-html="successText"></div>
      </div>
      <div class="bottom-btn"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  moduleConfig: any
}
const props = defineProps<Props>()
const successText = computed(() => props.moduleConfig?.msgContent?.msg_200 || '')
</script>
<style lang="scss" scoped>
/*成功页面跳转全屏展示浮层*/
.suc-page {
  padding: 0;
  text-align: center;
  width: 100%;
  display: inline-block;
  height: 100%;
  .success-img {
    margin-top: -0.2rem;
    width: 100px;
  }
}

.suc-content {
  max-width: 920px;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  position: relative;
  padding-top: 1.8rem;
}

.title-msg {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  font-size: 0.36rem;
  color: #666;
  :deep(*) {
    font-size: 0.36rem;
  }
}
.bottom-btn {
  height: 300px;
}
</style>
