<template>
  <div class="question-list-root">
    <div class="login-status">
      <img class="logo-img" src="/imgs/Logo.webp" alt="logo" />
      <div class="login-info">
        您好，{{ userInfo?.username }}
        <img class="login-info-img" src="/imgs/avatar.webp" />
        <span class="logout" @click="handleLogout">退出</span>
      </div>
    </div>
    <div class="list-content">
      <div class="top">
        <h2>问卷列表</h2>
        <el-button class="create-btn" type="default" @click="onCreate">
          <i class="iconfont icon-chuangjian"></i>
          <span>创建问卷</span>
        </el-button>
      </div>
      <BaseList />
    </div>
  </div>
</template>

<script>
import BaseList from './components/BaseList.vue'
import { mapState, mapActions } from 'vuex'
export default {
  components: { BaseList },
  name: 'listPage',
  computed: {
    ...mapState('user', ['userInfo'])
  },
  methods: {
    ...mapActions('user', ['logout']),
    onCreate() {
      this.$router.push('/create')
    },
    handleLogout() {
      this.logout()
      this.$router.replace({ name: 'login' })
    }
  }
}
</script>

<style lang="scss" scoped>
.question-list-root {
  height: 100%;
  background-color: #f6f7f9;
  .login-status {
    background: #fff;
    color: #4a4c5b;
    padding: 0 20px;
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo-img {
      width: 90px;
    }

    .login-info {
      display: flex;
      align-items: center;
      .login-info-img {
        margin-left: 10px;
        height: 30px;
        margin-top: -6px;
      }

      .logout {
        margin-left: 20px;
      }
    }

    span {
      cursor: pointer;
      color: #faa600;
    }
  }

  .list-content {
    height: calc(100% - 56px);
    padding: 20px;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        font-size: 18px;
      }

      .create-btn {
        width: 132px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #4a4c5b;
        color: #fff;

        .icon-chuangjian {
          padding-right: 8px;
          font-size: 14px;
        }

        span {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
