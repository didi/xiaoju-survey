<template>
  <div class="text-select-root">
    <el-select v-model="selectValue" :placeholder="options.label">
      <el-option
        v-for="item in options.value"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'TextSelect',
  data() {
    return {
      selectValue: this.options.default,
    };
  },
  props: {
    options: {
      type: Object,
      required: true,
    },
    effectFun: {
      type: Function,
    },
    effectKey: {
      type: String,
    },
  },
  watch: {
    selectValue(newSelect) {
      const { effectFun } = this;
      typeof effectFun === 'function' && effectFun(newSelect, this.effectKey);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 105px;
  line-height: 35px;
  margin-right: 20px;
  :deep(.el-input__inner) {
    border: none;
    height: 35px;
    //   line-height: 35px;
  }
  :deep(.el-icon-arrow-up:before) {
    position: relative;
    top: -2px;
  }
}
</style>
