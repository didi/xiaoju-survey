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
            <el-button
              type="default"
              class="btn"
              @click="onSetGroup"
              v-if="workSpaceId && menuType === MenuType.SpaceGroup"
            >
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
          ref="listRef"
          v-if="workSpaceId || groupId"
        ></BaseList>
        <RecycleBinList
          :loading="loading"
          :data="surveyList"
          :total="surveyTotal"
          @refresh="fetchSurveyList"
          ref="listRef"
          v-if="menuType === MenuType.RecycleBin"
        ></RecycleBinList>
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

    <el-dialog
      title="请选择创建方式"
      v-model="showCreateMethod"
      :before-close="handleCloseCreateDialog"
      :width="515"
    >
      <div class="create-method-list">
        <div class="create-method-item" @click="toCreate">
          <div class="icon">
            <i class="iconfont icon-kongbaichuangjian"></i>
          </div>
          <span>空白创建</span>
        </div>
        <div class="create-method-item" @click="openTextImport">
          <div class="icon">
            <i class="iconfont icon-wenbendaoru"></i>
          </div>
          <span>文本导入</span>
        </div>
        <div class="create-method-item" @click="opemAIGenerate">
          <div class="icon">
            <i class="iconfont icon-AIshengcheng"></i>
          </div>
          <span>AI生成</span>
        </div>
        <div class="create-method-item" @click="openExcelImport">
          <div class="icon">
            <i class="iconfont icon-Exceldaoru"></i>
          </div>
          <span>Excel导入</span>
        </div>
      </div>
    </el-dialog>
    <div class="fiexed-text-import-wrapper" v-if="showTextImport">
      <div class="text-import-header">
        <div class="return no-logo-return icon-fanhui" @click="showTextImport = false">返回</div>
        <div class="title">文本导入</div>
        <el-button type="primary" class="publish-btn" @click="onShowCreateForm">
          创建
        </el-button>
      </div>
      <TextImport @change="onTextImportChange"></TextImport>
    </div>
    <div class="fiexed-ai-generate-wrapper" v-if="showAIGenerate">
      <div class="ai-generate-header">
        
        <div class="nav-left">
         <img src="/imgs/s-logo.webp" class="logo" />
          <el-button link  @click="showAIGenerate = false">
            <i class="iconfont icon-fanhui"></i>
            返回
          </el-button>
        </div>
      <h2 class="nav-title">AI智能生成问卷</h2>
      <el-button type="primary"  class="publish-btn"  @click="onShowCreateForm">确定创建</el-button>
      </div>
      <AIGenerate @change="onAIGenerteChange"></AIGenerate>
    </div>
    <el-dialog
      v-model="showCreateForm"
      title="确定创建"
      width="500"
    >
      <CreateForm @cancel="showCreateForm = false" @confirm="onConfirmCreate"></CreateForm>
    </el-dialog>
    <ExcelImport
      v-if="showExcelImport"
      :visible="showExcelImport"
      @on-close-excel-import="onCloseExcelImport"
      @on-excel-upload-success="onExcelUploadSuccess"
      @on-show-create-form-excel-import="onShowCreateFormExcelImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BaseList from './components/BaseList.vue'
import RecycleBinList from './components/RecycleBinList.vue'
import SpaceList from './components/SpaceList.vue'
import GroupList from './components/GroupList.vue'
import SliderBar from './components/SliderBar.vue'
import SpaceModify from './components/SpaceModify.vue'
import GroupModify from './components/GroupModify.vue'
import TextImport from './components/TextImport.vue'
import ExcelImport from './components/ExcelImport.vue'
import AIGenerate from './components/AIGenerate.vue'

import TopNav from '@/management/components/TopNav.vue'
import CreateForm from '@/management/components/CreateForm.vue';
import { MenuType } from '@/management/utils/workSpace'

import { useWorkSpaceStore } from '@/management/stores/workSpace'
import { useSurveyListStore } from '@/management/stores/surveyList'
import { type IWorkspace } from '@/management/utils/workSpace'
import { createSurvey } from '@/management/api/survey'

const workSpaceStore = useWorkSpaceStore()
const surveyListStore = useSurveyListStore()

const { surveyList, surveyTotal } = storeToRefs(surveyListStore)
const {
  spaceMenus,
  workSpaceId,
  groupId,
  menuType,
  workSpaceList,
  workSpaceListTotal,
  groupList,
  groupListTotal
} = storeToRefs(workSpaceStore)
const router = useRouter()

const tableTitle = computed(() => {
  if (menuType.value === MenuType.PersonalGroup && !groupId.value) {
    return '我的空间'
  } else if (menuType.value === MenuType.SpaceGroup && !workSpaceId.value) {
    return '团队空间'
  } else if (menuType.value === MenuType.RecycleBin) {
    return ''
  } else {
    return currentTeamSpace.value?.name || '问卷列表'
  }
})

interface BaseListInstance {
  resetCurrentPage: () => void
}

const activeValue = ref('')
const listRef = ref<BaseListInstance | null>(null)

const loading = ref(false)

const spaceListRef = ref<any>(null)
const spaceLoading = ref(false)
const groupLoading = ref(false)

const showCreateMethod = ref(false)
const showTextImport = ref(false)
const showExcelImport = ref(false)
const showCreateForm = ref(false)
const questionList = ref<Array<any>>([])
const createMethod = ref('')
const isRecycleBin = computed(() => menuType.value === MenuType.RecycleBin);

const showAIGenerate = ref(false)

const fetchSpaceList = async (params?: any) => {
  spaceLoading.value = true
  workSpaceStore.changeWorkSpace('')
  await workSpaceStore.getSpaceList(params)
  spaceLoading.value = false
}

const fetchGroupList = async (params?: any) => {
  groupLoading.value = true
  workSpaceStore.changeWorkSpace('')
  await workSpaceStore.getGroupList(params)
  groupLoading.value = false
}

const getRecycleBinCount = async (params?: any) => {
  await workSpaceStore.getRecycleBinCount(params)
}

const handleSpaceSelect = async (id: string) => {
  if (activeValue.value === id) {
    return void 0
  }
  activeValue.value = id
  switch (id) {
    case MenuType.PersonalGroup:
      workSpaceStore.changeMenuType(MenuType.PersonalGroup)
      workSpaceStore.changeWorkSpace('')
      await fetchGroupList()
      // isRecycleBin.value = false
      break
    case MenuType.SpaceGroup:
      workSpaceStore.changeMenuType(MenuType.SpaceGroup)
      workSpaceStore.changeWorkSpace('')
      await fetchSpaceList()
      // isRecycleBin.value = false
      break
    case MenuType.RecycleBin:
      workSpaceStore.changeMenuType(MenuType.RecycleBin)
      workSpaceStore.changeWorkSpace('')
      // isRecycleBin.value = true
      await fetchSurveyList()
      break
    default: {
      // isRecycleBin.value = false
      const parentMenu = spaceMenus.value.find((parent: any) =>
        parent.children.find((children: any) => children.id.toString() === id)
      )
      if (parentMenu != undefined) {
        workSpaceStore.changeMenuType(parentMenu.id)
        if (parentMenu.id === MenuType.PersonalGroup) {
          workSpaceStore.changeGroup(id)
        } else if (parentMenu.id === MenuType.SpaceGroup) {
          workSpaceStore.changeWorkSpace(id)
        }
      }
      listRef?.value?.resetCurrentPage()
      await fetchSurveyList()
      break
    }
  }
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
  params.isRecycleBin = isRecycleBin.value
  loading.value = true
  await surveyListStore.getSurveyList(params)
  loading.value = false
}

onMounted(async () => {
  await Promise.all([fetchGroupList(), fetchSpaceList()])
  // 异步获取回收站数量
  getRecycleBinCount()
  activeValue.value = 'all'
  workSpaceStore.changeGroup('all')
  await fetchSurveyList()
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

const showGroupModify = ref<boolean>(false)

const onCloseGroupModify = () => {
  showGroupModify.value = false
  fetchGroupList()
}

const onGroupCreate = () => {
  showGroupModify.value = true
}

const onCreate = () => {
  showCreateMethod.value = true
}

const handleCloseCreateDialog = () => {
  showCreateMethod.value = false
}

const toCreate = () => {
  router.push('/create')
}

const openTextImport = () => {
  showCreateMethod.value = false;
  showTextImport.value = true;
  createMethod.value = 'textImport'
}

const opemAIGenerate = () => { 
  showCreateMethod.value = false;
  showAIGenerate.value = true;
  createMethod.value = 'AIGenerate'
}

const onShowCreateForm = () => {
  if (questionList.value.length <= 0) {
    ElMessage({
      type: 'error',
      message: '请导入题目'
    })
    return
  }
  showCreateForm.value = true
}

const onConfirmCreate = async (formValue: { title: string; remark?: string; surveyType: string; groupId?: string }, callback: (success: boolean) => void) => {
  try {
    switch(createMethod.value) {
      case 'ExcelImport':
      case 'textImport':{
        const payload: any = {
          ...formValue,
          createMethod: createMethod.value,
          questionList: questionList.value,
        }
        if (workSpaceId.value) {
          payload.workspaceId = workSpaceId.value
        }
        const res: any = await createSurvey(payload)
        if (res?.code === 200 && res?.data?.id) {
          callback(true)
          const id = res.data.id
          router.push({
            name: 'QuestionEditIndex',
            params: {
              id
            }
          })
          showCreateForm.value = false
        } else {
          ElMessage.error(res?.errmsg || '创建失败')
          callback(false)
        }
        break;
      }
      case 'AIGenerate':{
        const payload: any = {
          ...formValue,
          createMethod: createMethod.value,
          questionList: questionList.value,
        }
        if (workSpaceId.value) {
          payload.workspaceId = workSpaceId.value
        }
        const res: any = await createSurvey(payload)
        if (res?.code === 200 && res?.data?.id) {
          const id = res.data.id
          callback(true)
          router.push({
            name: 'QuestionEditIndex',
            params: {
              id
            }
          })
          showCreateForm.value = false
        } else {
          ElMessage.error(res?.errmsg || '创建失败')
          callback(false)
        }
        break;
      }
      default:
        callback(false)
        break;
    }
  } catch (error) {
    console.error('创建问卷失败:', error)
    ElMessage.error('创建失败，请稍后重试')
    callback(false)
  }
}

const onTextImportChange = (newQuestionList: Array<any>) => {
  questionList.value = newQuestionList
}


const openExcelImport = () => {
  showCreateMethod.value = false;
  showExcelImport.value = true;
  createMethod.value = 'ExcelImport'
}

const onCloseExcelImport = () => {
  showExcelImport.value = false
}

const onExcelUploadSuccess = (newQuestionList: Array<any>) => {
  questionList.value = newQuestionList
}

const onShowCreateFormExcelImport = () => {
  showCreateForm.value = true
}

const onAIGenerteChange = (newQuestionList: Array<any>) => {
  questionList.value = newQuestionList
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
.create-method-list {
  display: grid;
  grid-template-columns: 210px 210px;
  grid-template-rows: 60px 60px;
  grid-gap: 20px;
  width: 100%;
  padding: 10px 20px 30px 20px;
  .create-method-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding-left: 20px;
    background-color: #f6f7f9;
    border-radius: 4px;
    cursor: pointer;
    .icon {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #fff;
      margin-right: 15px;
      box-shadow: 1px 1px 5px 0 $primary-color;
      .iconfont {
        color: $primary-color;
      }
    }
    span {
      font-weight: 500;
    }
  }
}
.fiexed-text-import-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  .text-import-header {
    width: 100%;
    padding: 0 30px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 8px 0 rgba(74, 76, 91, 0.08);
    .return {
      margin-left: 20px;
      line-height: 56px;
      font-size: 16px;
      color: #6e707c;
      position: relative;
      cursor: pointer;
      &::before {
        position: absolute;
        left: -20px;
        bottom: 2px;
        font-weight: 600;
        content: '<';
      }
    }
    .title {
      font-size: 16px;
    }
  }
}
.fiexed-ai-generate-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 999;
  overflow-x: auto;
  overflow-y: hidden;

  .ai-generate-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 56px;
    min-width: 1280px;
    border-bottom: 1px solid #eee;
    flex-grow: 0;
    flex-shrink: 0;
 
    .nav-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .logo {
        height: 32px;
      }
    }

    .nav-title {
      font-size: 18px;
      color: #333;
    }
  }
}
</style>
