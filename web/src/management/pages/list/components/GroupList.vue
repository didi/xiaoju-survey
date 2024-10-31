<template>
    <div class="search">
      <TextSearch placeholder="请输入分组名称" :value="searchVal" @search="onSearchText" />
    </div>
    <div class="list-wrap" v-if="props.total">
      <el-table
        v-if="props.total"
        ref="multipleListTable"
        class="list-table"
        :data="data"
        empty-text="暂无数据"
        row-key="_id"
        header-row-class-name="tableview-header"
        row-class-name="tableview-row"
        cell-class-name="tableview-cell"
        v-loading="loading"
        :height="550"
        style="width: 100%"
      >
        <el-table-column column-key="space" width="20" />
        <el-table-column
          v-for="field in fieldList"
          :key="(field as any)?.key"
          :label="(field as any).title"
          :column-key="(field as any).key"
          :width="(field as any).width"
          :min-width="(field as any).width || (field as any).minWidth"
          class-name="link"
        >
          <template #default="scope">
            <template v-if="(field as any).comp">
              <component :is="(field as any).comp" type="table" :value="scope.row" />
            </template>
            <template v-else>
              <span class="cell-span">{{ scope.row[(field as any).key] }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          :width="200"
          label-class-name="operation"
          class-name="table-options"
        >
          <template #default="scope">
            <div class="space-tool-bar">
              <ToolBar
                :data="scope.row"
                :tool-width="50"
                :tools="tools"
                @click="handleClick"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <EmptyIndex :data="!searchVal ? noGroupDataConfig : noGroupSearchDataConfig" />
    </div>
    <div class="list-pagination">
      <el-pagination
        v-if="props.total"
        v-model:current-page="curPage"
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="props.total"
      >
      </el-pagination>
    </div>
    <GroupModify
      v-if="showGroupModify"
      type="edit"
      :visible="showGroupModify"
      @on-close-codify="onCloseModify"
    />
  </template>
  <script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import 'element-plus/theme-chalk/src/message-box.scss'
  import { get, map } from 'lodash-es'
  import {
    noGroupDataConfig,
    noGroupSearchDataConfig,
    groupListConfig
  } from '@/management/config/listConfig'
  import { MenuType } from '@/management/utils/workSpace'
  import GroupModify from './GroupModify.vue'
  import TextSearch from '@/management/pages/list/components/TextSearch.vue'
  import EmptyIndex from '@/management/components/EmptyIndex.vue'
  import ToolBar from './ToolBar.vue'
  import { useWorkSpaceStore } from '@/management/stores/workSpace'
  import { useSurveyListStore } from '@/management/stores/surveyList'

  const workSpaceStore = useWorkSpaceStore()
  const surveyListStore = useSurveyListStore()

  const showGroupModify = ref(false)
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits(['refresh'])
  const fields = ['name', 'surveyTotal', 'createdAt']
  const fieldList = computed(() => {
    return map(fields, (f) => {
      return get(groupListConfig, f, null)
    })
  })
  const tools = ref([{
    key: 'open',
    label: '进入'
  }, {
    key: 'modify',
    label: '管理'
  }, {
    key: 'delete',
    label: '删除'
  }])
  
  const data = computed(() => {
    return props.data
  })
  let searchVal = ref('')
  let curPage = ref(1)
  const emitRefresh = (page: number, name: string) => {
    curPage.value = page
    emit('refresh', {
      curPage: page,
      name
    })
  }
  const handleCurrentChange = async (val: number) => {
    emitRefresh(val, searchVal.value)
  }
  const onSearchText = async (value: string) => {
    searchVal.value = value
    emitRefresh(1, value)
  }
  
  const handleModify = (id: string) => {
    workSpaceStore.getGroupDetail(id)
    showGroupModify.value = true
  }
  const handleDelete = (id: string) => {
    ElMessageBox.confirm(
      '删除分组后，属于该分组的问卷将会自动更换到“未分组”下，是否确认本次删除？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(async () => {
        await workSpaceStore.deleteGroup(id)
        await workSpaceStore.getGroupList()
      })
      .catch(() => {})
  }
  
  const handleClick = (key: string, data: any) => {
    if (key === 'modify') {
      handleModify(data._id)
    } else if (key === 'delete') {
      handleDelete(data._id)
    } else if(key === 'open') {
      workSpaceStore.changeMenuType(MenuType.PersonalGroup)
      workSpaceStore.changeGroup(data._id)
      surveyListStore.getSurveyList({
        pageSize: 10,
        curPage: 1
      })
    }
  }
  
  const onCloseModify = () => {
    showGroupModify.value = false
    workSpaceStore.getGroupList()
  }
  
  defineExpose({ onCloseModify })
  </script>
  <style lang="scss" scoped>
  .search {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
  .list-pagination {
    margin-top: 20px;
    :deep(.el-pagination) {
      display: flex;
      justify-content: flex-end;
    }
  }
  .list-wrap {
    padding: 20px;
    background: #fff;
  
    .search {
      display: flex;
    }
  
    .list-table {
      :deep(.el-table__header) {
        .tableview-header .el-table__cell {
          .cell {
            height: 24px;
            color: #4a4c5b;
            font-size: 14px;
          }
        }
      }
  
      :deep(.tableview-row) {
        .tableview-cell {
          height: 42px;
  
          &.link {
            cursor: pointer;
          }
  
          .cell .cell-span {
            font-size: 14px;
          }
        }
      }
    }
  }
  </style>
  