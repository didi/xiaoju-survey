<template>
  <div class="question-list-root">
    <div class="top-nav">
      <div class="left">
        <img class="logo-img" src="/imgs/Logo.webp" alt="logo" />
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1" @click="handleSurvey">问卷列表</el-menu-item>
          <el-menu-item index="2">下载页面</el-menu-item>
        </el-menu>
      </div>
      <div class="login-info">
        您好，{{ userInfo?.username }}
        <img class="login-info-img" src="/imgs/avatar.webp" />
        <span class="logout" @click="handleLogout">退出</span>
      </div>
    </div>
    <div class="table-container">
      <DownloadList
        :loading="loading"
        :data="surveyList"
        :total="surveyTotal"
        @reflush="fetchSurveyList"
      ></DownloadList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import DownloadList from './components/DownloadList.vue'

const store = useStore()
const router = useRouter()
const userInfo = computed(() => {
  return store.state.user.userInfo
})
const surveyList = computed(() => {
  return store.state.download.surveyList
})
const surveyTotal = computed(() => {
  return store.state.download.surveyTotal
})
const handleSurvey = () => {
  router.push('/survey')
}
const handleLogout = () => {
  store.dispatch('user/logout')
  router.replace({ name: 'login' })
}
const loading = ref(false)

onMounted(() => {
  fetchSurveyList()
})
const fetchSurveyList = async (params?: any) => {
  if (!params) {
    params = {
      pageSize: 15,
      curPage: 1
    }
  }
  ;(params.ownerId = store.state.user.userInfo.username), (loading.value = true)
  await store.dispatch('download/getDownloadList', params)
  loading.value = false
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
    height: 100%;
    width: 100%; /* 确保容器宽度为100% */
  }
}
</style>
