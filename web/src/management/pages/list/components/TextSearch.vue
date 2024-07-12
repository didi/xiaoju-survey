<template>
  <div class="filter-input">
    <el-input
      v-model="curValue"
      @keyup.enter="onSearch"
      autocomplete="off"
      :placeholder="placeholder"
    >
      <template #suffix>
        <i-ep-search @click="onSearch" class="el-input__icon" />
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  components: {},
  name: 'TextSearch',
  props: {
    value: String,
    placeholder: String
  },
  data() {
    return {
      curValue: this.value
    }
  },
  watch: {
    value(val) {
      this.curValue = val
    }
  },
  methods: {
    onSearch() {
      this.$emit('search', this.curValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-input {
  position: relative;
  width: 200px;
  :deep(.el-input__wrapper) {
    height: 32px;
    line-height: 32px;
    padding: 0 25px;
    font-size: 12px;
    background: #ffffff;
    border-radius: 18px;
    &:focus {
      border-color: $primary-color;
    }
  }
  .el-input__icon {
    position: absolute;
    line-height: 32px;
    color: #7e7f8a;
    cursor: pointer;
    &:hover {
      color: $primary-color;
    }
  }
}
</style>
