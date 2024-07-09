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
        <div style="display: flex; justify-content: flex-end">
          <el-switch
            :model-value="isDownloadDesensitive"
            active-text="是否下载脱敏数据"
            @input="onisDownloadDesensitive"
            style="margin-right: 20px"
          >
          </el-switch>
          <el-button type="primary" @click="onDownload">导出数据</el-button>
        </div>
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
import { reactive, toRefs, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import EmptyIndex from '@/management/components/EmptyIndex.vue'
import { getRecycleList, downloadSurvey } from '@/management/api/analysis'
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
  tmpIsShowOriginData: false,
  isDownloadDesensitive: true
})

const { mainTableLoading, tableData, isShowOriginData, isDownloadDesensitive } = toRefs(dataTableState)

const route = useRoute()
const router = useRouter()

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
onMounted(() => {
  init()
})
const onDownload = async () => {
  try {
    await ElMessageBox.confirm('是否确认下载？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    console.log('取消下载')
    return
  }
  exportData()
  gotoDownloadList()
}

const gotoDownloadList = async () => {
  try {
    await ElMessageBox.confirm('计算中，是否前往下载中心？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch (error) {
    console.log('取消跳转')
    return
  }
  router.push('/survey/download')
}

const onisDownloadDesensitive = async () => {
  if (dataTableState.isDownloadDesensitive) {
    dataTableState.isDownloadDesensitive = false
  } else {
    dataTableState.isDownloadDesensitive = true
  }
}
const exportData = async () => {
  try {
    const res = await downloadSurvey({
      surveyId: String(route.params.id),
      isDesensitive: dataTableState.isDownloadDesensitive
    })
    if (res.code === 200) {
      ElMessage.success('下载成功')
    }
  } catch (error) {
    ElMessage.error('下载失败')
    ElMessage.error(error.message)
  }
}


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
