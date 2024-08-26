<template>
  <div class="question-list-root">
    <div class="top-nav">
      <div class="left">
        <img class="logo-img" src="/imgs/Logo.webp" alt="logo" />
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1" @click="handleSurvey">问卷列表</el-menu-item>
          <el-menu-item index="2">下载中心</el-menu-item>
        </el-menu>
      </div>
      <div class="login-info">
        您好，{{ userInfo?.username }}
        <img class="login-info-img" src="/imgs/avatar.webp" />
        <span class="logout" @click="handleLogout">退出</span>
      </div>
    </div>
    <div class="table-container">
      <DownloadTaskList></DownloadTaskList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/management/stores/user'
import { useRouter } from 'vue-router'
import DownloadTaskList from './components/DownloadTaskList.vue'

const userStore = useUserStore()
const router = useRouter()
const userInfo = computed(() => {
  return userStore.userInfo
})

const handleSurvey = () => {
  router.push('/survey')
}
const handleLogout = () => {
  userStore.logout()
  router.replace({ name: 'login' })
}

const activeIndex = ref('2')
</script>

<style>
.question-list-root {
  height: 100%;
  background-color: #f6f7f9;
  .top-nav {
    background: #fff;
    color: #4a4c5b;
    padding: 0 20px;
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
    .left {
      display: flex;
      align-items: center;
      width: calc(100% - 200px);
      .logo-img {
        width: 90px;
        height: fit-content;
        padding-right: 20px;
      }
      .el-menu {
        width: 100%;
        height: 56px;
        border: none !important;
        :deep(.el-menu-item, .is-active) {
          border: none !important;
        }
      }
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
  .table-container {
    padding: 20px;
    display: flex;
    justify-content: center;
    width: 100%; /* 确保容器宽度为100% */
  }
}
</style>
