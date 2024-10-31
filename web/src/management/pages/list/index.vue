<template>
  <div class="question-list-root">
    <TopNav></TopNav>
    <div class="content-wrap">
      <SliderBar :menus="spaceMenus" :activeValue="activeValue" @select="handleSpaceSelect" />
      <div class="list-content">
        <div class="top">
          <h2>
            {{ tableTitle }}
          </h2>
          <div class="operation">
            <el-button
              class="btn create-btn"
              type="default"
              @click="onSpaceCreate"
              v-if="menuType === MenuType.SpaceGroup && !workSpaceId"
            >
              <i class="iconfont icon-chuangjian"></i>
              <span>创建团队空间</span>
            </el-button>
            <el-button
              class="btn create-btn"
              type="default"
              @click="onGroupCreate"
              v-if="menuType === MenuType.PersonalGroup && !groupId"
            >
              <i class="iconfont icon-chuangjian"></i>
              <span>创建分组</span>
            </el-button>
            <el-button type="default" class="btn" @click="onSetGroup" v-if="workSpaceId && menuType === MenuType.SpaceGroup">
              <i class="iconfont icon-shujuliebiao"></i>
              <span>团队管理</span>
            </el-button>
            <el-button
              class="btn create-btn"
              type="default"
              @click="onCreate"
              v-if="workSpaceId || groupId"
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
          @refresh="fetchSurveyList"
          v-if="workSpaceId || groupId"
        ></BaseList>
        <SpaceList
          ref="spaceListRef"
          @refresh="fetchSpaceList"
          :loading="spaceLoading"
          :data="workSpaceList"
          :total="workSpaceListTotal"
          v-if="menuType === MenuType.SpaceGroup && !workSpaceId"
        ></SpaceList>
        <GroupList
          ref="groupListRef"
          @refresh="fetchGroupList"
          :loading="groupLoading"
          :data="groupList"
          :total="groupListTotal"
          v-if="menuType === MenuType.PersonalGroup && !groupId"
        ></GroupList>
      </div>
    </div>
    <SpaceModify
      v-if="showSpaceModify"
      :type="modifyType"
      :visible="showSpaceModify"
      @on-close-codify="onCloseSpaceModify"
      @update-data="onCloseModifyInTeamWork"
    />
    <GroupModify
      v-if="showGroupModify"
      type="add"
      :visible="showGroupModify"
      @on-close-codify="onCloseGroupModify"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseList from './components/BaseList.vue'
import SpaceList from './components/SpaceList.vue'
import GroupList from './components/GroupList.vue'
import SliderBar from './components/SliderBar.vue'
import SpaceModify from './components/SpaceModify.vue'
import GroupModify from './components/GroupModify.vue'
import TopNav from '@/management/components/TopNav.vue'
import {  MenuType } from '@/management/utils/workSpace'

import { useWorkSpaceStore } from '@/management/stores/workSpace'
import { useSurveyListStore } from '@/management/stores/surveyList'
import { type IWorkspace } from '@/management/utils/workSpace'

const workSpaceStore = useWorkSpaceStore()
const surveyListStore = useSurveyListStore()

const { surveyList, surveyTotal } = storeToRefs(surveyListStore)
const { spaceMenus, workSpaceId, groupId, menuType, workSpaceList, workSpaceListTotal, groupList, groupListTotal } =
  storeToRefs(workSpaceStore)
const router = useRouter()

const tableTitle = computed(() => {
  if(menuType.value === MenuType.PersonalGroup && !groupId.value) {
    return '我的空间'
  } else if (menuType.value === MenuType.SpaceGroup && !workSpaceId.value) {
    return '团队空间'
  } else {
    return currentTeamSpace.value?.name || '问卷列表';
  }
})

const activeValue = computed(() => {
  if(workSpaceId.value !== '') {
    return workSpaceId.value
  } else if(groupId.value !== '') {
    return groupId.value
  } else if(menuType.value === MenuType.PersonalGroup) {
    return MenuType.PersonalGroup
  } else if(menuType.value === MenuType.SpaceGroup) {
    return MenuType.SpaceGroup
  } else {
    return ''
  }
})

const loading = ref(false)

const spaceListRef = ref<any>(null)
const spaceLoading = ref(false)
const groupLoading = ref(false)

const fetchSpaceList = async (params?: any) => {
  spaceLoading.value = true
  workSpaceStore.changeWorkSpace('')
  workSpaceStore.getSpaceList(params)
  spaceLoading.value = false
}

const fetchGroupList = async (params?: any) => {
  groupLoading.value = true
  workSpaceStore.changeWorkSpace('')
  workSpaceStore.getGroupList(params)
  groupLoading.value = false
}

const handleSpaceSelect = (id: MenuType | string) => {
  if (groupId.value === id || workSpaceId.value === id) {
    return void 0
  }
  let parentMenu = undefined
  switch (id) {
    case MenuType.PersonalGroup:
      workSpaceStore.changeMenuType(MenuType.PersonalGroup)
      workSpaceStore.changeWorkSpace('')
      fetchGroupList()
      break
    case MenuType.SpaceGroup:
      workSpaceStore.changeMenuType(MenuType.SpaceGroup)
      workSpaceStore.changeWorkSpace('')
      fetchSpaceList()
      break
    default:
      parentMenu = spaceMenus.value.find((parent: any) => parent.children.find((children: any) => children.id.toString() === id))
      if(parentMenu != undefined) {
        workSpaceStore.changeMenuType(parentMenu.id)
        if(parentMenu.id === MenuType.PersonalGroup) {
          workSpaceStore.changeGroup(id)
        } else if (parentMenu.id === MenuType.SpaceGroup) {
          workSpaceStore.changeWorkSpace(id)
        }
      }
      break
  }
  fetchSurveyList()
}

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
  await surveyListStore.getSurveyList(params)
  loading.value = false
}

onMounted(() => {
  fetchGroupList()
  fetchSpaceList()
  fetchSurveyList()
})

const modifyType = ref('add')
const showSpaceModify = ref(false)

// 当前团队信息
const currentTeamSpace = computed(() => {
  return workSpaceList.value.find((item: any) => item._id === workSpaceId.value)
})

const onSetGroup = async () => {
  await workSpaceStore.getSpaceDetail(workSpaceId.value)
  modifyType.value = 'edit'
  showSpaceModify.value = true
}

const onCloseModifyInTeamWork = (data: IWorkspace) => {
  if (activeValue.value === MenuType.SpaceGroup) {
    const currentData = workSpaceList.value.find((item) => item._id === data._id)
    if (currentData) {
      currentData.name = data.name
      currentData.memberTotal = data.members.length
      currentData.description = data.description
    }
    const currentMenus: any = spaceMenus.value?.[1]?.children?.find(
      (item: { id: string; name: string }) => item.id === data._id
    )
    if (currentMenus) {
      currentMenus.name = data.name
    }
  }
}

const onCloseSpaceModify = (type: string) => {
  showSpaceModify.value = false
  if (type === 'update' && spaceListRef.value) {
    fetchSpaceList()
    spaceListRef.value.onCloseModify()
  }
}
const onSpaceCreate = () => {
  modifyType.value = 'add'
  showSpaceModify.value = true
}

// 分组

const showGroupModify = ref<boolean>(false)

const onCloseGroupModify = () => {
  showGroupModify.value = false
  fetchGroupList()
}

const onGroupCreate = () => {
  showGroupModify.value = true
}

const onCreate = () => {
  router.push('/create')
}
</script>

<style lang="scss" scoped>
.question-list-root {
  height: 100%;
  background-color: #f6f7f9;
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
        color: #fff;
      }

      .btn {
        width: 132px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon-shujuliebiao,
        .icon-chuangjian {
          padding-right: 5px;
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
