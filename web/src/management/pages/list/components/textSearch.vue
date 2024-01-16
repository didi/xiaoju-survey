<template>
    <div class="filter-input">
      <input
          :class="['text-search_root']"
          v-model="curValue"
          @keyup.enter="onSearch"
          autocomplete="off"
          :placeholder="placeholder"
          type="text"
          rows="1"
          class="el-input__inner"
      />
      <i class="el-icon-search el-input__icon" @click="onSearch"></i>
  </div>
</template>
<script>
export default {
name: 'TextSearch',
props: {
  value: String,
  placeholder: String
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
      .el-input__inner {
          height: 32px;
          line-height: 32px;
          padding: 0 25px;
          font-size: 12px;
          background: #FFFFFF;
          border: 1px solid $border-color;
          border-radius: 18px;
          &:focus {
              border-color: $primary-color;
          }
      }
      .el-icon-search {
          position: absolute;
          line-height: 32px;
          right: 10px;
          color: #7E7F8A;
          cursor: pointer;
          &:hover {
              color:$primary-color;
          }
      }
  }
</style>
