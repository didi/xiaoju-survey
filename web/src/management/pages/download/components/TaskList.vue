<template>
  <div v-loading="loading" class="list-wrapper">
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
        :class-name="field.key"
        :formatter="field.formatter"
      >
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="{ row }">
          <span
            v-if="row?.status === 'succeed'"
            class="text-btn download-btn"
            @click="handleDownload(row)"
          >
            下载
          </span>
          <span class="text-btn delete-btn" @click="openDeleteDialog(row)"> 删除 </span>
        </template>
      </el-table-column>
    </el-table>
    <div v-else>
      <EmptyIndex :data="noDownloadTaskConfig" />
    </div>
    <div class="list-pagination" v-if="total">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        size="small"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { get, map } from 'lodash-es'
import { ElMessage, ElMessageBox } from 'element-plus'
import EmptyIndex from '@/management/components/EmptyIndex.vue'
import { noDownloadTaskConfig } from '@/management/config/listConfig'

import { deleteDownloadTask, getDownloadTaskList } from '@/management/api/download'
import { CODE_MAP } from '@/management/api/base'

const loading = ref(false)
const pageSize = ref(10)
const total = ref(0)
const dataList: Array<any> = reactive([])

onMounted(() => {
  getList({ pageIndex: 1 })
})
const getList = async ({ pageIndex }: { pageIndex: number }) => {
  if (!pageIndex) {
    pageIndex = 1
  }
  const params = {
    pageSize: pageSize.value,
    pageIndex
  }

  const res: Record<string, any> = await getDownloadTaskList(params)
  if (res.code === CODE_MAP.SUCCESS) {
    total.value = res.data.total
    const list = res.data.list as any
    dataList.splice(0, dataList.length, ...list)
  }
  loading.value = false
}

const statusTextMap: Record<string, string> = {
  waiting: '排队中',
  computing: '计算中',
  succeed: '已完成',
  failed: '导出失败',
}

let currentDelRow: Record<string, any> = {}
// 下载文件
const handleDownload = async (row: any) => {
  if (row.url) {
    window.open(row.url)
  } else {
    ElMessageBox.alert('文件不存在')
  }
}
// 删除文件
const openDeleteDialog = async (row: any) => {
  try {
    await ElMessageBox.confirm('是否确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    currentDelRow = row
    confirmDelete()
  } catch (error) {
    console.log('取消删除')
  }
}

// 确认删除文件
const confirmDelete = async () => {
  try {
    const res: Record<string, any> = await deleteDownloadTask(currentDelRow.taskId)
    if (res.code !== CODE_MAP.SUCCESS) {
      ElMessage.error(res.errmsg)
    } else {
      ElMessage.success('删除成功')
      await getList({ pageIndex: 1 })
    }
  } catch (error) {
    ElMessage.error('删除失败，请刷新重试')
  }
}

const fields = ['filename', 'fileSize', 'createdAt', 'status']

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
  createdAt: {
    title: '下载时间',
    key: 'createdAt',
    width: 240
  },
  status: {
    title: '状态',
    key: 'status',
    formatter(row: Record<string, any>, column: Record<string, any>) {
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
    width: 90%;
    min-width: 1080px;
    padding: 10px 20px;
    background: #fff;
    margin: 0 auto;

    .list-table {
      .cell {
        text-align: center;
      }
      .text-btn {
        font-size: 14px;
        cursor: pointer;
        margin-left: 20px;
        &:first-child {
          margin-left: 0;
        }
      }
      .download-btn {
        color: $primary-color;
      }
      .delete-btn {
        color: red;
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
