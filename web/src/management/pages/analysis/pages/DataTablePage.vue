<template>
  <div class="data-table-page">
    <template v-if="tableData.total">
      <div class="menus">
        <el-switch
          :model-value="isShowOriginData"
          active-text="是否展示原数据"
          @input="onIsShowOriginChange"
        >
        </el-switch>
      </div>
    </template>

    <template v-if="tableData.total">
      <DataTable :main-table-loading :table-data />
      <el-pagination
        background
        layout="prev, pager, next"
        popper-class="analysis-pagination"
        :total="tableData.total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </template>
    <div v-else>
      <EmptyIndex :data="noDataConfig" />
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import EmptyIndex from '@/management/components/EmptyIndex.vue'
import { getRecycleList } from '@/management/api/analysis'
import { noDataConfig } from '@/management/config/analysisConfig'
import DataTable from '../components/DataTable.vue'

const dataTableState = reactive({
  mainTableLoading: false,
  tableData: {
    total: 0,
    listHead: [],
    listBody: []
  },
  currentPage: 1,
  isShowOriginData: false,
  tmpIsShowOriginData: false
})

const { mainTableLoading, tableData, isShowOriginData } = toRefs(dataTableState)

const route = useRoute()

const formatHead = (listHead) => {
  const head = []

  listHead.forEach((headItem) => {
    head.push({
      field: headItem.field,
      title: headItem.title
    })

    if (headItem.othersCode?.length) {
      headItem.othersCode.forEach((item) => {
        head.push({
          field: item.code,
          title: `${headItem.title}-${item.option}`
        })
      })
    }
  })

  return head
}

const onIsShowOriginChange = async (data) => {
  if (dataTableState.mainTableLoading) {
    return
  }
  dataTableState.tmpIsShowOriginData = data
  await init()
  dataTableState.isShowOriginData = data
}

const handleCurrentChange = async (page) => {
  if (dataTableState.mainTableLoading) {
    return
  }
  dataTableState.currentPage = page
  await init()
}

const init = async () => {
  if (!route.params.id) {
    ElMessage.error('没有传入问卷参数~')
    return
  }
  dataTableState.mainTableLoading = true
  try {
    const res = await getRecycleList({
      page: dataTableState.currentPage,
      surveyId: route.params.id,
      isDesensitive: !dataTableState.tmpIsShowOriginData // 发起请求的时候，isShowOriginData还没改变，暂存了一个字段
    })

    if (res.code === 200) {
      const listHead = formatHead(res.data.listHead)
      dataTableState.tableData = { ...res.data, listHead }
      dataTableState.mainTableLoading = false
    }
  } catch (error) {
    ElMessage.error('查询回收数据失败，请重试')
  }
}

init()
</script>

<style lang="scss" scoped>
.data-table-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.menus {
  margin-bottom: 20px;
}

:deep(.el-pagination) {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.data-list {
  margin-bottom: 20px;
}
</style>
