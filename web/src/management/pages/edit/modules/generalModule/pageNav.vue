<template>
  <div class="content">
    <template v-for="btnItem in btnList" :key="btnItem.key">
      <router-link
        class="navbar-btn"
        :to="{ name: btnItem.router }"
        tag="div"
        replace
      >
        <i class="iconfont" :class="[btnItem.icon]"></i>
        <span>{{ btnItem.text }}</span>
      </router-link>
      <i
        v-if="btnItem.next"
        :key="btnItem.key + '-next'"
        class="iconfont icon-jiantou next"
      ></i>
    </template>
  </div>
</template>
<script>
export default {
  name: 'pageTitle',
  props: {},
  data() {
    return {
      btnList: [
        {
          icon: 'icon-wenjuanbianji',
          text: '问卷编辑',
          router: 'QuestionEditIndex',
          key: 'edit',
          next: true,
        },
        {
          icon: 'icon-wenjuanshezhi',
          text: '问卷设置',
          router: 'QuestionEditSetting',
          key: 'settings',
          next: true,
        },
        {
          icon: 'icon-jieguoyeshezhi',
          text: '结果页设置',
          router: 'QuestionEditResultConfig',
          key: 'status',
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;

  .navbar-btn {
    position: relative;
    color: #92949d;
    padding: 0 20px;
    cursor: pointer;

    &.router-link-exact-active {
      color: $font-color-title;

      &::before {
        content: '';
        position: absolute;
        width: 90px;
        height: 3px;
        background-color: $primary-color;
        bottom: -16px;
        left: 20px;
      }
    }

    // &.router-link-exact-active {
    //   color: #4a4c5b;
    // }
    .iconfont {
      margin-right: 12px;
    }
  }
}
</style>
