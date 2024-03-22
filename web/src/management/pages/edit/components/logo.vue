<template>
  <div class="container">
    <div class="question-logo" @click="onSelect">
      <img
        v-if="logoImg !== ''"
        :style="{ width: logoConf.logoImageWidth }"
        class="bottom-logo"
        :src="logoImg"
      />
      <div class="logo-placeholder-wrapper" v-else>
        <div class="logo-placeholder">LOGO</div>
        <div class="no-logo-tip">若不配置logo，该图片将不会在问卷中展示</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LogoPreview',
  props: {
    logoConf: {
      type: Object,
      default: () => {}
    },
    isSelected: Boolean,
  },
  data() {
    return {};
  },
  methods: {
    onSelect() {
      this.$emit('select');
    },
  },
  computed: {
    logoImg() {
      const { logoImage = {} } = this.logoConf;
      return logoImage;
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.container {
  display: flex;
  justify-content: center;
}
.question-logo {
  max-width: 300px;
  text-align: center;
  padding: 0 0 0.6rem;
  margin-top: -0.2rem;
  cursor: pointer;
}

.logo-placeholder-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .logo-placeholder {
    width: 200px;
    height: 50px;
    font-size: 40px;
    color: #d8d8d8;
    letter-spacing: 0;
    line-height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #d8d8d8;
  }

  .no-logo-tip {
    font-size: 13px;
    line-height: 13px;
    opacity: 0.5;
    margin-top: 13px;
    color: #92949d;
  }
}
</style>
