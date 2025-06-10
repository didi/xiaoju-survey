<template>
  <div class="tableview-root">
    <div class="filter-wrap">
      <div class="search">
        <TextSearch placeholder="请输入问卷标题" :value="searchVal" @search="onSearchText" />
      </div>
    </div>
    <div class="list-wrapper" v-if="total">
      <el-table
        v-if="total"
        ref="multipleListTable"
        class="list-table"
        :data="dataList"
        empty-text="暂无数据"
        row-key="_id"
        header-row-class-name="tableview-header"
        row-class-name="tableview-row"
        cell-class-name="tableview-cell"
        style="width: 100%"
        v-loading="loading"
        @row-click="onRowClick"
      >
        <el-table-column column-key="space" width="20" />

        <el-table-column
          v-for="recycleField in recycleFieldList"
          :key="recycleField.key"
          :label="recycleField.title"
          :column-key="recycleField.key"
          :width="recycleField.width"
          :min-width="recycleField.width || recycleField.minWidth"
          class-name="link"
        >
          <template #default="scope">
            <template v-if="recycleField.comp">
              <component
                :is="currentComponent(recycleField.comp)"
                type="table"
                :value="unref(scope.row)"
              />
            </template>
            <template v-else>
              <span class="cell-span">{{ scope.row[recycleField.key] }}</span>
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作" :width="230" class-name="table-options" fixed="right">
          <template #default="scope">
            <ToolBar
              :data="scope.row"
              type="list"
              :tools="getToolConfig(scope.row)"
              :tool-width="50"
              @click="handleClick"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="list-pagination" v-if="total">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        v-model:current-page="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    

    <ModifyDialog
      :type="modifyType"
      :visible="showModify"
      :question-info="questionInfo"
      :group-all-list="groupAllList"
      :menu-type="menuType"
      @on-close-codify="onCloseModify"
    />
    <CooperModify :modifyId="cooperId" :visible="cooperModify" @on-close-codify="onCooperClose" />
  </div>
</template>

<script setup>
import { ref, computed, unref } from 'vue'
import { useRouter } from 'vue-router'
import { get, map } from 'lodash-es'
import { storeToRefs } from 'pinia'

import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

import EmptyIndex from '@/management/components/EmptyIndex.vue'
import CooperModify from '@/management/components/CooperModify/ModifyDialog.vue'
import { CODE_MAP } from '@/management/api/base'
import { QOP_MAP } from '@/management/utils/constant.ts'
import { deleteSurvey, pausingSurvey, restoreSurvey, completelyDeleteSurvey} from '@/management/api/survey'
import { useWorkSpaceStore } from '@/management/stores/workSpace'
import { useSurveyListStore } from '@/management/stores/surveyList'
import ModifyDialog from './ModifyDialog.vue'
import TagModule from './TagModule.vue'
import StateModule from './StateModule.vue'
import ToolBar from './ToolBar.vue'
import TextSearch from './TextSearch.vue'
import TextSelect from './TextSelect.vue'
import TextButton from './TextButton.vue'
import { SurveyPermissions } from '@/management/utils/workSpace'

import {
  recycleFieldConfig,
  noListDataConfig,
  noSearchDataConfig,
  selectOptionsDict,
  buttonOptionsDict,
  curStatus,
  subStatus
} from '@/management/config/listConfig'

const surveyListStore = useSurveyListStore()
const workSpaceStore = useWorkSpaceStore()
const { workSpaceId, groupAllList, menuType } = storeToRefs(workSpaceStore)
const router = useRouter()
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
const recycleFields = [ 'title', 'createdAt','deletedAt','owner']
const showModify = ref(false)
const modifyType = ref('')
const questionInfo = ref({})
const currentPage = ref(1)
const { searchVal, selectValueMap, buttonValueMap } = storeToRefs(surveyListStore)

const currentComponent = computed(() => {
  return (componentName) => {
    switch (componentName) {
      case 'TagModule':
        return TagModule
      case 'StateModule':
        return StateModule
      default:
        return null
    }
  }
})

const recycleFieldList = computed(() => {
  return map(recycleFields, (f) => {
    return get(recycleFieldConfig, f, null)
  })
})
const data = computed(() => {
  return props.data
})
const total = computed(() => {
  return props.total
})


const dataList = computed(() => {
  return data.value
    .map((item) => {
      return {
        ...item,
        'curStatus.date': item.curStatus.date,
        'subStatus.date': item.subStatus.date,
      }
    })
    .sort((a, b) => {
      // 按删除时间倒序排序
      return new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
    })
})

const order = computed(() => {
  const formatOrder = Object.entries(buttonValueMap.value)
    .filter(([, effectValue]) => effectValue)
    .reduce((prev, item) => {
      const [effectKey, effectValue] = item
      prev.push({ field: effectKey, value: effectValue })
      return prev
    }, [])
  return JSON.stringify(formatOrder)
})

const onRefresh = async () => {
  let params = {
    curPage: currentPage.value,
    order: order.value
  }
  if (workSpaceId.value) {
    params.workspaceId = workSpaceId.value
  }
  emit('refresh', params)
}

const getToolConfig = (row) => {
  let funcList = []
  const permissionsBtn = [
    {
      key: 'restore',
      label: '恢复'
    },
    {
      key: 'completelyDelete',
      label: '彻底删除'
    },
  ]
  funcList = funcList.concat(permissionsBtn)
  const order = ['restore', 'completelyDelete']
  const result = funcList.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
  return result
}
const handleClick = (key, data) => {
  switch (key) {
    case 'restore':
      onRestore(data)
      return
    case 'completelyDelete':
      onCompletelyDelete(data)
      return
    default:
      return
  }
}

const onRestore = async (row) => {
  try {
    await ElMessageBox.confirm('是否确认恢复？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  const res = await restoreSurvey(row._id)
  if (res.code === CODE_MAP.SUCCESS) {
    ElMessage.success('恢复成功')
    onRefresh()
    workSpaceStore.getGroupList()
    workSpaceStore.getSpaceList()
  } else {
    ElMessage.error(res.errmsg || '恢复失败')
  }
}

const onCompletelyDelete = async (row) => {
  try {
    await ElMessageBox.confirm('将从回收站中永久删除该问卷，是否确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    return
  }

  const res = await completelyDeleteSurvey(row._id)
  if (res.code === CODE_MAP.SUCCESS) {
    ElMessage.success('删除成功')
    onRefresh()
    workSpaceStore.getGroupList()
    workSpaceStore.getSpaceList()
  } else {
    ElMessage.error(res.errmsg || '删除失败')
  }
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  onRefresh()
}

const onRowClick = (row) => {
  ElMessage.warning('该问卷已被删除，无法继续访问。')
}
const onSearchText = (e) => {
  searchVal.value = e
  currentPage.value = 1
  onRefresh()
}
const onSelectChange = (selectKey, selectValue) => {
  surveyListStore.changeSelectValueMap(selectKey, selectValue)
  currentPage.value = 1
  onRefresh()
}
const onButtonChange = (effectKey, effectValue) => {
  surveyListStore.resetButtonValueMap()
  surveyListStore.changeButtonValueMap(effectKey, effectValue)
  onRefresh()
}

const cooperModify = ref(false)
const cooperId = ref('')
const onCooper = async (row) => {
  cooperId.value = row._id
  cooperModify.value = true
}
const onCooperClose = () => {
  cooperModify.value = false
}
const resetCurrentPage = () => {
  currentPage.value = 1
  onRefresh()
}

defineExpose({
  resetCurrentPage
})
</script>

<style lang="scss" scoped>
.tableview-root {
  .filter-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .select {
      display: flex;
    }

    .search {
      display: flex;
      margin-left: auto;
    }
  }

  .list-wrapper {
    padding: 10px 20px;
    background: #fff;

    .list-table {
      min-height: 620px;
    }
  }

  .list-pagination {
    margin-top: 20px;

    :deep(.el-pagination) {
      display: flex;
      justify-content: flex-end;
    }
  }

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
      padding: 5px 0;

      &.link {
        cursor: pointer;
      }

      .cell .cell-span {
        font-size: 14px;
      }
    }
  }
}

.el-select-dropdown__wrap {
  background: #eee;
}

.el-select-dropdown__item.hover {
  background: #fff;
}

:deep(.el-table__row) {
  height: 60px;
}
</style>