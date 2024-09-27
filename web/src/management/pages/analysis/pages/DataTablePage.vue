<template>
  <div class="data-table-page">
    <template v-if="tableData.total">
      <div class="menus">
        <el-button type="primary" :loading="isDownloading" @click="onDownload"
          >导出全部数据</el-button
        >
        <el-switch
          class="desensitize-switch"
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

    <el-dialog v-model="downloadDialogVisible" title="导出确认" width="500" style="padding: 40px">
      <el-form :model="downloadForm" label-width="100px" label-position="left">
        <el-form-item label="导出内容">
          <el-radio-group v-model="downloadForm.isMasked">
            <el-radio :value="true">脱敏数据</el-radio>
            <el-radio :value="false">原回收数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="download-tips">
          <div>注：</div>
          <div>
            <p>推荐优先下载脱敏数据，如手机号：1***3。</p>
            <p>原回收数据可能存在敏感信息，请谨慎下载。</p>
          </div>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="downloadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDownload()"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import EmptyIndex from '@/management/components/EmptyIndex.vue'
import { getRecycleList } from '@/management/api/analysis'
import { noDataConfig } from '@/management/config/analysisConfig'
import DataTable from '../components/DataTable.vue'
import { createDownloadTask, getDownloadTask } from '@/management/api/download'

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
  isDownloading: false,
  downloadDialogVisible: false,
  downloadForm: {
    isMasked: true
  }
})

const { mainTableLoading, tableData, isShowOriginData, downloadDialogVisible, isDownloading } =
  toRefs(dataTableState)
const downloadForm = dataTableState.downloadForm

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
      isMasked: !dataTableState.tmpIsShowOriginData // 发起请求的时候，isShowOriginData还没改变，暂存了一个字段
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
  dataTableState.downloadDialogVisible = true
}

const confirmDownload = async () => {
  if (isDownloading.value) {
    return
  }
  try {
    isDownloading.value = true
    const createRes = await createDownloadTask({
      surveyId: route.params.id,
      isMasked: downloadForm.isMasked
    })
    dataTableState.downloadDialogVisible = false
    if (createRes.code !== 200) {
      ElMessage.error('导出失败，请重试')
    }
    ElMessage.success(`下载文件计算中，可前往“下载中心”查看`)
    try {
      const taskInfo = await checkIsTaskFinished(createRes.data.taskId)
      if (taskInfo.url) {
        window.open(taskInfo.url)
        ElMessage.success('导出成功')
      }
    } catch (error) {
      ElMessage.error('导出失败，请重试')
    }
  } catch (error) {
    ElMessage.error('导出失败，请重试')
  } finally {
    isDownloading.value = false
  }
}

const checkIsTaskFinished = (taskId) => {
  return new Promise((resolve, reject) => {
    const run = () => {
      getDownloadTask(taskId).then((res) => {
        if (res.code === 200 && res.data) {
          const status = res.data.status
          if (status === 'new' || status === 'computing') {
            setTimeout(() => {
              run()
            }, 5000)
          } else {
            resolve(res.data)
          }
        } else {
          reject('导出失败')
        }
      })
    }
    run()
  })
}
</script>

<style lang="scss" scoped>
.data-table-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.download-tips {
  display: flex;
  color: #ec4e29;
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

.desensitize-switch {
  float: right;
}
</style>
