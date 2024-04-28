<template>
  <div class="skin-content">
    <div class="navbar-tab"> 
      <el-radio-group style="margin-bottom: 30px" v-model="activeRouter">
        <el-radio-button v-for="btnItem in btnList" :key="btnItem.router" :label="btnItem.text" :value="btnItem.router" />
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
          text: '问卷设置',
          router: 'QuestionEditIndex',
          key: 'questionEdit',
          next: true,
        },
        {
          text: '逻辑设置',
          router: 'LogicEdit',
          key: 'logicEdit',
        },
      ],
    };
  },
  watch: {
    activeRouter: {
      handler (val)  {
        this.$router.push({ name: val})
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.skin-content {
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
    z-index: 9999;
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      color: $primary-color;
      background-color: #fff !important;
      // &:active{
      //   color: $primary-color;
      // }
    }
  }
}
</style>