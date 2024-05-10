<template>
  <div class="question-content">
    <div class="navbar-tab">
      <el-radio-group v-model="activeRouter">
        <el-radio-button
          v-for="btnItem in btnList"
          :key="btnItem.router"
          :label="btnItem.text"
          :value="btnItem.router"
        />
      </el-radio-group>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'QuestionPage',
  props: {},
  data() {
    return {
      activeRouter: this.$route.name,
      btnList: [
        {
          text: '内容设置',
          router: 'QuestionEditIndex',
          key: 'questionEdit'
        },
        {
          text: '逻辑设置',
          router: 'LogicIndex',
          key: 'logicEdit'
        }
      ]
    }
  },
  watch: {
    activeRouter: {
      handler(val) {
        this.$router.push({ name: val })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.question-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  .navbar-tab {
    position: absolute;
    top: 10px;
    cursor: pointer;
    :deep(.el-radio-button__original-radio + .el-radio-button__inner) {
      font-size: 12px;
      height: 28px;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      color: $primary-color;
      background-color: #fff !important;
    }
  }
}
</style>
