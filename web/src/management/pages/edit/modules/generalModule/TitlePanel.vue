<template>
  <div class="title-container">
    <div class="title">
      {{ showTitle }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
const showTitle = props.title
</script>

<style lang="scss" scoped>
.title-container {
  width: 280px;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
}

.title:hover {
  overflow: visible;
  white-space: normal;
  background: white;
  position: absolute;
  z-index: 1;
  padding: 5px;
  border: 1px solid #ddd;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px; /* 设置一个最大宽度，防止标题过长 */
}
</style>

