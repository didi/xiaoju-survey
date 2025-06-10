<template>
  <div class="recycle-bin-list">
    <el-table
      :data="recycleBinList"
      v-loading="loading"
      style="width: 100%"
      v-if="recycleBinList.length > 0"
    >
      <el-table-column prop="title" label="问卷标题" min-width="180">
        <template #default="{ row }">
          <div class="title">{{ row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="180">
        <template #default="{ row }">
          <div>{{ formatDate(row.createdAt) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="deletedAt" label="删除时间" min-width="180">
        <template #default="{ row }">
          <div>{{ formatDate(row.deletedAt) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template #default="{ row }">
          <div class="operation">
            <el-button type="primary" text @click="onRestore(row._id, row.surveyPath)">恢复</el-button>
            <el-button type="danger" text @click="onDelete(row._id)">彻底删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <EmptyIndex
      v-else
      :data="emptyConfig"
    />
    <div class="list-pagination" v-if="recycleBinList.length > 0">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
        :page-size="10"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import EmptyIndex from '@/management/components/EmptyIndex.vue'
import { useRecycleBinStore } from '@/management/stores/recycleBin'
import { useWorkSpaceStore } from '@/management/stores/workSpace'
import dayjs from 'dayjs'

const props = defineProps<{
  loading: boolean
  data: any[]
  total: number
}>()

const emit = defineEmits(['refresh'])

const recycleBinStore = useRecycleBinStore()
const workSpaceStore = useWorkSpaceStore()
const recycleBinList = computed(() => props.data)

// 空数据配置
const emptyConfig = {
  title: '回收站中暂无问卷',
  desc: '删除的问卷将会在这里显示',
  img: '/imgs/icons/list-empty.webp'
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 恢复问卷
const onRestore = (id: string, surveyPath: string) => {
  ElMessageBox.confirm('确定要恢复这份问卷吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const success = await recycleBinStore.restoreSurveyById(id, surveyPath)
    if (success) {
      // 刷新列表
      emit('refresh')
      // 更新回收站数量
      workSpaceStore.updateRecycleBinCount()
    }
  }).catch(() => {})
}

// 永久删除问卷
const onDelete = (id: string) => {
  ElMessageBox.confirm('永久删除后将无法恢复，确定要删除这份问卷吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  }).then(async () => {
    const success = await recycleBinStore.deleteSurveyPermanently(id)
    if (success) {
      // 刷新列表
      emit('refresh')
      // 更新回收站数量
      workSpaceStore.updateRecycleBinCount()
    }
  }).catch(() => {})
}

// 分页处理
const handleCurrentChange = (page: number) => {
  emit('refresh', { curPage: page })
}
</script>

<style lang="scss" scoped>
.recycle-bin-list {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  
  .title {
    font-weight: 500;
    cursor: pointer;
    &:hover {
      color: #409EFF;
    }
  }
  
  .operation {
    display: flex;
    gap: 10px;
  }
  
  .list-pagination {
    margin-top: 20px;
    :deep(.el-pagination) {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style> 