<template>
  <div class="filter-input">
    <el-input
      v-model="curValue"
      @keyup.enter="onSearch"
      autocomplete="off"
      :placeholder="placeholder"
    >
      <template #suffix>
        <el-icon @click="onSearch"><ElIconSearch /></el-icon>
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

<style lang="scss" rel="stylesheet/scss" scoped>
// @import '@didi/question-common/assets/css/variable';
.filter-input {
  position: relative;
  width: 200px;
  :deep(.el-input__wrapper) {
    border-radius: 18px;
  }
  :deep(.el-icon) {
    cursor: pointer;
    &:hover{
      color: var(--el-color-primary);
    }
  }
}
</style>
