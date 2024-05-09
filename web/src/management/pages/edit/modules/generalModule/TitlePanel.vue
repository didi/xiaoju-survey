<template>
  <div class="title">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'TitlePanel',
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
