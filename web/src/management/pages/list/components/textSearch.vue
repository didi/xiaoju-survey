<template>
  <div class="filter-input">
    <el-input
      v-model="curValue"
      @keyup.enter="onSearch"
      autocomplete="off"
      :placeholder="placeholder"
    >
      <template #suffix>
        <el-icon class="el-input__icon"><ElIconSearch /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script>
import { Search as ElIconSearch } from '@element-plus/icons-vue'

export default {
  components: {
    ElIconSearch,
  },
  name: 'TextSearch',
  props: {
    value: String,
    placeholder: String,
  },
  data() {
    return {
      curValue: this.value,
    }
  },
  watch: {
    value(val) {
      this.curValue = val
    },
  },
  methods: {
    onSearch() {
      this.$emit('search', this.curValue)
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
// @import '@didi/question-common/assets/css/variable';
.filter-input {
  position: relative;
  width: 200px;
  // .el-input__inner {
  //   height: 32px;
  //   line-height: 32px;
  //   padding: 0 25px;
  //   font-size: 12px;
  //   background: #ffffff;
  //   border: 1px solid $border-color;
  //   border-radius: 18px;
  //   &:focus {
  //     border-color: $primary-color;
  //   }
  // }
  // .el-icon-search {
  //   position: absolute;
  //   line-height: 32px;
  //   right: 10px;
  //   color: #7e7f8a;
  //   cursor: pointer;
  //   &:hover {
  //     color: $primary-color;
  //   }
  // }
}
</style>
