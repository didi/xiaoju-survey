<template>
  <div class="tableview-root">
    <div class="filter-wrap">
      <div class="select">
        <TextSelect
          v-for="item in Object.keys(selectOptionsDict)"
          :key="item"
          :options="selectOptionsDict[item]"
          :value="selectValueMap[item]"
          @change="(value) => onSelectChange(item, value)"
        />
      </div>
      <div class="search">
        <TextButton
          v-for="item in Object.keys(buttonOptionsDict)"
          :key="item"
          @change="(value) => onButtonChange(item, value)"
          :option="buttonOptionsDict[item]"
          :icon="
            buttonOptionsDict[item].icons.find(
              (iconItem) => iconItem.effectValue === buttonValueMap[item]
            ).icon
          "
          link
        />
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
          v-for="field in fieldList"
          :key="field.key"
          :label="field.title"
          :column-key="field.key"
          :width="field.width"
          :min-width="field.width || field.minWidth"
          class-name="link"
        >
          <template #default="scope">
            <template v-if="field.comp">
              <component
                :is="currentComponent(field.comp)"
                type="table"
                :value="unref(scope.row)"
              />
            </template>
            <template v-else>
              <span class="cell-span">{{ scope.row[field.key] }}</span>
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
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <div v-else>
      <EmptyIndex :data="!searchVal ? noListDataConfig : noSearchDataConfig" />
    </div>

    <ModifyDialog
      :type="modifyType"
      :visible="showModify"
      :question-info="questionInfo"
      @on-close-codify="onCloseModify"
    />
    <CooperModify :modifyId="cooperId" :visible="cooperModify" @on-close-codify="onCooperClose" />
  </div>
</template>

<script setup>
import { ref, computed, unref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { get, map } from 'lodash-es'

import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

import moment from 'moment'
// 引入中文
import 'moment/locale/zh-cn'
// 设置中文
moment.locale('zh-cn')

import EmptyIndex from '@/management/components/EmptyIndex.vue'
import CooperModify from '@/management/components/CooperModify/ModifyDialog.vue'
import { CODE_MAP } from '@/management/api/base'
import { QOP_MAP } from '@/management/utils/constant.ts'
import { deleteSurvey } from '@/management/api/survey'
import ModifyDialog from './ModifyDialog.vue'
import TagModule from './TagModule.vue'
import StateModule from './StateModule.vue'
import ToolBar from './ToolBar.vue'
import TextSearch from './TextSearch.vue'
import TextSelect from './TextSelect.vue'
import TextButton from './TextButton.vue'
import { SurveyPermissions } from '@/management/utils/types/workSpace'

import {
  fieldConfig,
  noListDataConfig,
  noSearchDataConfig,
  selectOptionsDict,
  buttonOptionsDict
} from '@/management/config/listConfig'

const store = useStore()
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
const fields = ['type', 'title', 'remark', 'owner', 'state', 'createDate', 'updateDate']
const showModify = ref(false)
const modifyType = ref('')
const questionInfo = ref({})

const currentPage = ref(1)
const searchVal = computed(() => {
  return store.state.list.searchVal
})
const selectValueMap = computed(() => {
  return store.state.list.selectValueMap
})
const buttonValueMap = computed(() => {
  return store.state.list.buttonValueMap
})
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

const fieldList = computed(() => {
  return map(fields, (f) => {
    return get(fieldConfig, f, null)
  })
})
const data = computed(() => {
  return props.data
})
const total = computed(() => {
  return props.total
})
const dataList = computed(() => {
  return data.value.map((item) => {
    return {
      ...item,
      'curStatus.date': item.curStatus.date
    }
  })
})
const filter = computed(() => {
  return [
    {
      comparator: '',
      condition: [
        {
          field: 'title',
          value: searchVal.value,
          comparator: '$regex'
        }
      ]
    },
    {
      comparator: '',
      condition: [
        {
          field: 'curStatus.status',
          value: selectValueMap.value['curStatus.status']
        }
      ]
    },
    {
      comparator: '',
      condition: [
        {
          field: 'surveyType',
          value: selectValueMap.value.surveyType
        }
      ]
    }
  ]
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
const workSpaceId = computed(() => {
  return store.state.list.workSpaceId
})

const onRefresh = async () => {
  const filterString = JSON.stringify(
    filter.value.filter((item) => {
      return item.condition[0].value
    })
  )
  let params = {
    curPage: currentPage.value,
    filter: filterString,
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
      key: QOP_MAP.EDIT,
      label: '修改'
    },
    {
      key: 'delete',
      label: '删除',
      icon: 'icon-shanchu'
    },
    {
      key: QOP_MAP.COPY,
      label: '复制',
      icon: 'icon-shanchu'
    },
    {
      key: 'analysis',
      label: '数据'
    },
    {
      key: 'release',
      label: '投放'
    },
    {
      key: 'cooper',
      label: '协作'
    }
  ]
  if (!store.state.list.workSpaceId) {
    if (!row.isCollaborated) {
      // 创建人显示协作按钮
      funcList = funcList.concat(permissionsBtn)
    } else {
      if (row.currentPermissions.includes(SurveyPermissions.DataManage)) {
        // 协作人判断权限显示数据分析按钮
        funcList.push({
          key: 'analysis',
          label: '数据'
        })
      }
      if (row.currentPermissions.includes(SurveyPermissions.SurveyManage)) {
        // 协作人判断权限显示投放按钮
        funcList.push(
          {
            key: QOP_MAP.EDIT,
            label: '修改'
          },
          {
            key: 'delete',
            label: '删除',
            icon: 'icon-shanchu'
          },
          {
            key: QOP_MAP.COPY,
            label: '复制',
            icon: 'icon-shanchu'
          },
          {
            key: 'release',
            label: '投放'
          }
        )
      }
      if (row.currentPermissions.includes(SurveyPermissions.CollaboratorManage)) {
        // 协作人判断权限显示协作按钮
        funcList.push({
          key: 'cooper',
          label: '协作'
        })
      }
    }
  } else {
    // 团队空间没有开放协作功能，不需要判断按钮状态
    permissionsBtn.splice(-1)
    funcList = permissionsBtn
  }
  const order = ['edit', 'analysis', 'release', 'delete', 'copy', 'cooper']
  const result = funcList.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))

  return result
}
const handleClick = (key, data) => {
  switch (key) {
    case QOP_MAP.EDIT:
      onModify(data, QOP_MAP.EDIT)
      return
    case QOP_MAP.COPY:
      onModify(data, QOP_MAP.COPY)
      return
    case 'analysis':
      router.push({
        name: 'analysisPage',
        params: {
          id: data._id
        }
      })
      return
    case 'release':
      router.push({
        name: 'publish',
        params: {
          id: data._id
        }
      })
      return
    case 'delete':
      onDelete(data)
      return
    case 'cooper':
      onCooper(data)
      return
    default:
      return
  }
}
const onDelete = async (row) => {
  try {
    await ElMessageBox.confirm('是否确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    console.log('取消删除')
    return
  }

  const res = await deleteSurvey(row._id)
  if (res.code === CODE_MAP.SUCCESS) {
    ElMessage.success('删除成功')
    onRefresh()
  } else {
    ElMessage.error(res.errmsg || '删除失败')
  }
}
const handleCurrentChange = (current) => {
  currentPage.value = current
  onRefresh()
}
const onModify = (data, type = QOP_MAP.EDIT) => {
  showModify.value = true
  modifyType.value = type
  questionInfo.value = data
}
const onCloseModify = (type) => {
  showModify.value = false
  questionInfo.value = {}
  if (type === 'update') {
    onRefresh()
  }
}
const onRowClick = (row) => {
  router.push({
    name: 'QuestionEditIndex',
    params: {
      id: row._id
    }
  })
}
const onSearchText = (e) => {
  store.commit('list/setSearchVal', e)
  currentPage.value = 1
  onRefresh()
}
const onSelectChange = (selectKey, selectValue) => {
  store.commit('list/changeSelectValueMap', { key: selectKey, value: selectValue })
  // selectValueMap.value[selectKey] = selectValue
  currentPage.value = 1
  onRefresh()
}
const onButtonChange = (effectKey, effectValue) => {
  store.commit('list/resetButtonValueMap')
  store.commit('list/changeButtonValueMap', { key: effectKey, value: effectValue })
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
</style>
