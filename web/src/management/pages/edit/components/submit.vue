<template>
  <div
    class="submit-wrapper"
    @click="onClick"
    :class="{ isSelected: isSelected }"
  >
    <el-button
      class="submit-btn"
      type="primary"
      >{{ submitConf.submitTitle }}</el-button
    >
  </div>
</template>
<script>
export default {
  name: 'Submit',
  data() {
    return {};
  },
  props: {
    submitConf: Object,
    isSelected: Boolean,
    skinConf: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onClick() {
      this.$emit('select');
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.submit-wrapper {
  padding: 25px;
  text-align: center;

  .submit-btn {
    color: white;
    border: none;
    width: 100%;
    height: 44px;
    background-color: var(--primary-color);
  }
}
</style>
