<template>
  <div class="skin-content">
    <div class="navbar-tab"> 
      <el-radio-group size="mini" style="margin-bottom: 30px;" v-model="activeRouter">
        <el-radio-button :label="btnItem.router" :key="btnItem.router" v-for="btnItem in btnList" >
          <span>{{ btnItem.text }}</span>
        </el-radio-button>
      </el-radio-group>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'skinPage',
  props: {},
  data() {
    return {
      activeRouter: this.$route.name,
      btnList: [
        {
          text: '内容页',
          router: 'QuestionSkinSetting',
          key: 'skinsettings',
          next: true,
        },
        {
          text: '结果页',
          router: 'QuestionEditResultConfig',
          key: 'status',
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
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner{
        color:  $primary-color;
        background-color: #fff!important;
        // &:active{
        //   color: $primary-color;
        // }
    }
    
  }
}
</style>
