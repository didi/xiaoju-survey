<template>
  <div class="question-list-root">
    <div class="top-nav">
      <div class="left">
        <img class="logo-img" src="/imgs/Logo.webp" alt="logo" />
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1">问卷列表</el-menu-item>
        </el-menu>
      </div>
      <div class="login-info">
        您好，{{ userInfo?.username }}
        <img class="login-info-img" src="/imgs/avatar.webp" />
        <span class="logout" @click="handleLogout">退出</span>
      </div>
    </div>
    <div class="content-wrap">
      <SliderBar :menus="spaceMenus" @select="handleSpaceSelect" />
      <div class="list-content">
        <div class="top">
          <h2>{{ spaceType === SpaceType.Group ? '团队空间' : '问卷' }}列表</h2>
          <div class="operation">
            <el-button
              class="btn space-btn"
              type="default"
              @click="onSpaceCreate"
              v-if="spaceType == SpaceType.Group"
            >
              <i class="iconfont icon-chuangjian"></i>
              <span>创建团队空间</span>
            </el-button>
            <el-button
              class="btn create-btn"
              type="default"
              @click="onCreate"
              v-if="spaceType !== SpaceType.Group"
            >
              <i class="iconfont icon-chuangjian"></i>
              <span>创建问卷</span>
            </el-button>
          </div>
        </div>
        <BaseList
          :loading="loading"
          :data="surveyList"
          :total="surveyTotal"
          @reflush="fetchSurveyList"
          v-if="spaceType !== SpaceType.Group"
        ></BaseList>
        <SpaceList v-if="spaceType === SpaceType.Group"></SpaceList>
      </div>
    </div>
    <SpaceModify
      v-if="showSpaceModify"
      :type="modifyType"
      :visible="showSpaceModify"
      @on-close-codify="onCloseModify"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/management/stores/user'
import { useListStore } from '@/management/stores/list'
import { useRouter } from 'vue-router'
import BaseList from './components/BaseList.vue'
import SpaceList from './components/SpaceList.vue'
import SliderBar from './components/SliderBar.vue'
import SpaceModify from './components/SpaceModify.vue'
import { SpaceType } from '@/management/utils/types/workSpace'

const router = useRouter()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const listStore = useListStore()
const { spaceMenus, workSpaceId, spaceType, surveyList, surveyTotal } = storeToRefs(listStore)
const { changeSpaceType, changeWorkSpace, getSpaceList, getSurveyList } = listStore

const loading = ref(false)
const activeIndex = ref('1')

const handleSpaceSelect = (id: any) => {
  if (id === SpaceType.Personal) {
    // 点击个人空间菜单
    if (spaceType.value === SpaceType.Personal) {
      return
    }
    changeSpaceType(SpaceType.Personal)
    changeWorkSpace('')
  } else if (id === SpaceType.Group) {
    // 点击团队空间组菜单
    if (spaceType.value === SpaceType.Group) {
      return
    }
    changeSpaceType(SpaceType.Group)
    changeWorkSpace('')
  } else if (!Object.values(SpaceType).includes(id)) {
    // 点击具体团队空间
    if (workSpaceId.value === id) {
      return
    }
    changeSpaceType(SpaceType.Teamwork)
    changeWorkSpace(id)
  }

  fetchSurveyList()
}
onMounted(() => {
  getSpaceList()
  fetchSurveyList()
})
const fetchSurveyList = async (params?: any) => {
  if (!params) {
    params = {
      pageSize: 10,
      curPage: 1
    }
  }
  if (workSpaceId.value) {
    params.workspaceId = workSpaceId.value
  }
  loading.value = true
  await getSurveyList(params)
  loading.value = false
}
const modifyType = ref('add')
const showSpaceModify = ref(false)

const onCloseModify = (type: string) => {
  showSpaceModify.value = false
  if (type === 'update') getSpaceList()
}
const onSpaceCreate = () => {
  showSpaceModify.value = true
}
const onCreate = () => {
  router.push('/create')
}
const handleLogout = () => {
  userStore.logout()
  router.replace({ name: 'login' })
}
</script>

<style lang="scss" scoped>
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
  .content-wrap {
    position: relative;
    height: calc(100% - 56px);
  }
  .list-content {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 32px 32px 32px 232px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: scroll;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      .operation {
        flex: 0 1 auto;
        display: flex;
      }

      h2 {
        font-size: 18px;
      }

      .create-btn {
        background: #4a4c5b;
      }
      .space-btn {
        background: $primary-color;
      }
      .btn {
        width: 132px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;

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
