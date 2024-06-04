<template>
  <div class="over-time">
    <img class="over-img" src="/imgs/icons/overtime.webp" />
    <p class="title-msg" v-safe-html="resultText"></p>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  moduleConfig: any
}
const props = defineProps<Props>()
const resultText = computed(() => props.moduleConfig?.msgContent?.msg_9001 || '问卷已过期')
</script>
<style lang="scss" scoped>
.over-time {
  text-align: center;
  margin-bottom: 5.5rem;
  height: 100%;

  .title-msg {
    width: 100%;
    font-size: 16px;
    color: #666;
  }
}

.over-time .over-img {
  margin-top: 1.6rem;
  margin-bottom: 15px;
  width: 100px;
}
</style>
