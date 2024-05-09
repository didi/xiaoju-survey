<template>
  <div class="title">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'pageTitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 400px;
  white-space: nowrap;
}
</style>
