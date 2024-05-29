<template>
  <div class="title">
    {{ title }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 400px;
  white-space: nowrap;
}
</style>
