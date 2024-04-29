<template>
  <div class="nav">
    <LogoIcon />
    <RouterLink v-for="(tab, index) in tabList" :key="index" class="tab-btn" :to="tab.to" replace>
      <div class="icon">
        <i class="iconfont" :class="tab.icon"></i>
      </div>
      <p>{{ tab.text }}</p>
    </RouterLink>
  </div>
</template>

<script>
import LogoIcon from './LogoIcon.vue'

export default {
  name: 'LeftMenu',
  components: {
    LogoIcon
  },
  data() {
    return {
      tabList: [
        {
          text: '编辑问卷',
          icon: 'icon-bianji',
          to: {
            name: 'QuestionEditPage'
          }
        },
        {
          text: '投放问卷',
          icon: 'icon-toufang',
          to: {
            name: 'publishResultPage'
          }
        },
        {
          text: '数据统计',
          icon: 'icon-shujutongji',
          to: {
            name: 'analysisPage'
          }
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  width: 80px;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  box-shadow: 2px 0 10px 0 rgba(173, 200, 218, 0.26);
}

.tab-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  color: $normal-color-light;

  &:hover {
    color: $normal-color;

    // background-color: $background-color-light;
    .icon {
      background-color: $disable-color;
    }
  }

  .icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
    border-radius: 2px;

    .iconfont {
      font-size: 20px;
      line-height: 1;
    }
  }

  p {
    font-size: 12px;
  }

  &.router-link-active {
    background-color: $background-color-light;
    color: #2b2c33;

    .icon {
      background-color: $primary-color;
    }
  }
}
</style>
