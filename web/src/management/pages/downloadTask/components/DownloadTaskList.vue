<template>
  <div v-loading="loading" class="list-wrapper" v-if="total">
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
    >
      <el-table-column
        v-for="field in fieldList"
        :key="field.key"
        :prop="field.key"
        :label="field.title"
        :width="field.width"
        class-name="link"
        :formatter="field.formatter"
      >
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="{ row }">
          <el-button size="small" @click="handleDownload(row)"> 下载 </el-button>
          <el-button type="primary" size="small" @click="openDeleteDialog(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="list-pagination" v-if="total">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :size="pageSize"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <el-dialog v-model="centerDialogVisible" title="" width="500" align-center>
      <span>确认删除下载记录吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="confirmDelete"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { get, map } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { deleteDownloadTask, getDownloadTaskList } from '@/management/api/downloadTask'
import { CODE_MAP } from '@/management/api/base'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

import moment from 'moment'
// 引入中文
import 'moment/locale/zh-cn'
// 设置中文
moment.locale('zh-cn')

const loading = ref(false)
const pageSize = ref(15)
const total = ref(0)
const dataList = reactive([])

onMounted(() => {
  getList({ pageIndex: 1 })
})
const getList = async ({ pageIndex }: { pageIndex: number }) => {
  if (!pageIndex) {
    pageIndex = 1
  }
  const params = {
    pageSize: pageSize.value,
    pageIndex,
  }

  const res: Record<string, any> = await getDownloadTaskList(params)
  if (res.code === CODE_MAP.SUCCESS) {
    total.value = res.data.total
    dataList.values = res.data.list
  }
  loading.value = false
}

const statusTextMap: Record<string, string> = {
  new: '排队中',
  computing: '计算中',
  finished: '已完成',
  removed: '已删除',
};

const centerDialogVisible = ref(false)
let currentDelRow: Record<string, any> = {}
// 下载文件
const handleDownload = async (row: any) => {
  if (row.curStatus.status === 'removed') {
    ElMessage.error('文件已删除')
    return
  }
  if (row.url) {
    window.open(row.url)
  }
}
// 删除文件
const openDeleteDialog = (row: any) => {
  centerDialogVisible.value = true
  currentDelRow = row
}

// 确认删除文件
const confirmDelete = async () => {
  try {
    await deleteDownloadTask(currentDelRow.taskId)
    await getList({ pageIndex: 1 })
  } catch (error) {
    ElMessage.error("删除失败，请刷新重试")
  }
  centerDialogVisible.value = false
}

const fields = ['filename', 'fileSize', 'createDate', 'curStatus']

const fieldList = computed(() => {
  return map(fields, (f) => {
    return get(downloadListConfig, f)
  })
})

const downloadListConfig = {
  filename: {
    title: '文件名称',
    key: 'filename',
    width: 340,
    tip: true
  },
  fileSize: {
    title: '预估大小',
    key: 'fileSize',
    width: 140
  },
  createDate: {
    title: '下载时间',
    key: 'createDate',
    width: 240
  },
  curStatus: {
    title: '状态',
    key: 'curStatus.status',
    formatter(row: Record<string, any>, column: Record<string, any>) {
      console.log({
        row,
        column,
      })
      return statusTextMap[get(row, column.rawColumnKey)]
    }
  }
}

const handleCurrentChange = (val: number) => {
  getList({ pageIndex: val })
}
</script>

<style lang="scss" scoped>
.question-list-root {
  height: 100%;
  background-color: #f6f7f9;

  .list-wrapper {
    padding: 10px 20px;
    background: #fff;

    .list-table {
      .cell {
        text-align: center;
      }
    }
    .small-text {
      color: red;
    }
    .list-pagination {
      margin-top: 20px;
      :deep(.el-pagination) {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
