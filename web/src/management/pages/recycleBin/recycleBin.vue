<template>
  <TopNav></TopNav>
    <div class="recycle-bin-page">
      <h2>回收站</h2>
      <!-- 展示问卷列表 -->
      <BaseList
          :loading="loading"
          :data="surveyList"
          :total="surveyTotal"
          @refresh="fetchRecycleList"
          ref="listRef"
          :recycleBin="true"
          v-if="workSpaceId || groupId"
      ></BaseList>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import BaseList from '@/management/pages/list/components/BaseList.vue'
  import { useSurveyListStore } from '@/management/stores/surveyList'
  import { useWorkSpaceStore } from '@/management/stores/workSpace'
  import TopNav from '@/management/components/TopNav.vue'

  const workSpaceStore = useWorkSpaceStore()
  const surveyListStore = useSurveyListStore()
  const { surveyList, surveyTotal } = storeToRefs(surveyListStore)
  const { spaceMenus, workSpaceId, groupId, menuType, workSpaceList, workSpaceListTotal, groupList, groupListTotal } =
  storeToRefs(workSpaceStore)
  const router = useRouter()

  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  
  const fetchRecycleList = async (params?: any) => {
    if (!params) {
      params = {
        pageSize: 10,
        curPage: 1
      }
    }

    const extraOrder = [
      {
        field: 'curStatus.date',
        value: -1
      }
    ];

    params.recycle = true;
    params.extraOrder = extraOrder;

    if (workSpaceId.value) {
      params.workspaceId = workSpaceId.value
    }
    loading.value = true
    await surveyListStore.getSurveyList(params)
    loading.value = false
  }
  
  onMounted(() => {
    fetchRecycleList()
  })
  </script>
  
  <style scoped>
  .recycle-bin-page {
    padding: 20px;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  </style>