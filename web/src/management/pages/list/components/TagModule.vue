<template>
  <span :class="['list-tag-root', 'list-tag-' + type]">
    <div class="tag-bg"></div>
    <span>{{ surveyType[value.surveyType] || surveyType[value.questionType] }}</span>
  </span>
</template>

<script>
import { type as surveyType } from '@/management/config/listConfig'
export default {
  name: 'TagModule',
  props: {
    value: Object,
    type: String
  },
  data() {
    return {
      surveyType
    }
  }
}
</script>

<style lang="scss" scoped>
.list-tag-root {
  display: inline-block;
  position: relative;
  span {
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    transform-origin: 1px;
    transform: scale(0.5);
    border-radius: 1px;
    box-sizing: content-box;
    border: 2px solid $border-color;
    white-space: nowrap;
    display: inline-block;
  }
  &.list-tag-card {
    .tag-bg {
      width: 50%;
      height: 50%;
      position: absolute;
      background: $normal-color;
      border-radius: 0px 100px 100px 0px;
      opacity: 0.7;
    }
  }
}
</style>
