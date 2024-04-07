<template>
  <div class="container">
    <div v-if="logoImage" class="logo-wrapper">
      <img
        :style="{ width: !isMobile ? '20%' : logoImageWidth || '20%' }"
        :src="logoImage"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'logoPreview',
  computed: {
    logoImage() {
      return this.$store.state?.bottomConf?.logoImage;
    },
    logoImageWidth() {
      return this.$store.state?.bottomConf?.logoImageWidth;
    },
    isMobile() {
      return this.$store.state?.isMobile;
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.container {
  display: flex;
  justify-content: center;
}

.logo-wrapper {
  text-align: center;
  font-size: 0;
  padding: 0.1rem 0 0.5rem;
}
</style>
