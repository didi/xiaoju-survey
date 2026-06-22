<template>
  <div class="suc-page">
    <div class="suc-content">
      <div class="title-box">
        <img src="/imgs/icons/success.webp" class="success-img" />
        <div class="title-msg" v-safe-html="successText"></div>
      </div>
      <div v-if="jumpConfig.buttonText && jumpConfig.type === 'button'" class="jump-btn">
        {{ jumpConfig.buttonText }}
      </div>
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
const jumpConfig = computed(() => props.moduleConfig?.jumpConfig || {})
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
.jump-btn {
  background: var(--primary-color);
  width: 90%;
  border-radius: 0.08rem;
  padding: 0.25rem 0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.25rem;
  font-weight: 500;
  margin: 0 auto;
  border: none;
}
</style>
