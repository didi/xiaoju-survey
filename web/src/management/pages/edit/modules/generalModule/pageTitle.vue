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
      default: '',
    },
  },
};
</script>
<style lang="scss" scoped></style>
