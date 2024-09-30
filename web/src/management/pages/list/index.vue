<template>
  <div class="question-list-root">
    <TopNav></TopNav>
    <div class="content-wrap">
      <SliderBar :menus="spaceMenus" @select="handleSpaceSelect" />
      <div class="list-content">
        <div class="top">
          <h2>
            {{ spaceType === SpaceType.Group ? '团队空间' : currentTeamSpace?.name || '问卷列表' }}
          </h2>
          <div class="operation">
            <el-button
              class="btn create-btn"
              type="default"
              @click="onSpaceCreate"
              v-if="spaceType == SpaceType.Group"
            >
              <i class="iconfont icon-chuangjian"></i>
              <span>创建团队空间</span>
            </el-button>
            <el-button type="default" class="btn" @click="onSetGroup" v-if="workSpaceId">
              <i class="iconfont icon-shujuliebiao"></i>
              <span>团队管理</span>
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
          @refresh="fetchSurveyList"
          v-if="spaceType !== SpaceType.Group"
        ></BaseList>
        <SpaceList
          ref="spaceListRef"
          @refresh="fetchSpaceList"
          :loading="spaceLoading"
          :data="workSpaceList"
          :total="workSpaceListTotal"
          v-if="spaceType === SpaceType.Group"
        ></SpaceList>
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
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseList from './components/BaseList.vue'
import SpaceList from './components/SpaceList.vue'
import SliderBar from './components/SliderBar.vue'
import SpaceModify from './components/SpaceModify.vue'
import TopNav from '@/management/components/TopNav.vue'
import { SpaceType } from '@/management/utils/workSpace'
import { useWorkSpaceStore } from '@/management/stores/workSpace'
import { useSurveyListStore } from '@/management/stores/surveyList'

const workSpaceStore = useWorkSpaceStore()
const surveyListStore = useSurveyListStore()

const { surveyList, surveyTotal } = storeToRefs(surveyListStore)
const { spaceMenus, workSpaceId, spaceType, workSpaceList, workSpaceListTotal } =
  storeToRefs(workSpaceStore)
const router = useRouter()

const loading = ref(false)

const spaceListRef = ref<any>(null)
const spaceLoading = ref(false)

const fetchSpaceList = async (params?: any) => {
  spaceLoading.value = true
  workSpaceStore.changeWorkSpace('')
  workSpaceStore.getSpaceList(params)
  spaceLoading.value = false
}

const handleSpaceSelect = (id: SpaceType | string) => {
  if (id === spaceType.value || id === workSpaceId.value) {
    return void 0
  }

  switch (id) {
    case SpaceType.Personal:
      workSpaceStore.changeSpaceType(SpaceType.Personal)
      workSpaceStore.changeWorkSpace('')
      break
    case SpaceType.Group:
      workSpaceStore.changeSpaceType(SpaceType.Group)
      workSpaceStore.changeWorkSpace('')
      fetchSpaceList()
      break
    default:
      workSpaceStore.changeSpaceType(SpaceType.Teamwork)
      workSpaceStore.changeWorkSpace(id)
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

const onCloseModify = (type: string) => {
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
