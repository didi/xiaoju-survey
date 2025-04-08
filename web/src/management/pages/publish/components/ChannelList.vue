<template>
  <el-table :data="channelList" style="width: 100%">
    <el-table-column prop="_id" label="渠道ID" width="230" />
    <el-table-column prop="name" label="投放名称" width="180" >
      <template #default="scope">
        <div class="channel_name">
          <i :class="['iconfont channel_icon',CHANNEL_TYPE_ICON[scope.row.type as CHANNEL_TYPE] ] "></i>
          <span>{{ scope.row.name }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" width="150" >
      <template #default="scope">
        <el-tag :type="scope.row.status === 'recycling' ? 'success' : 'danger'">{{ CHANNEL_STATUS_TEXT[scope.row.status as CHANNEL_STATUS] }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="count" label="回收量" />
    <el-table-column prop="createdAt" label="创建日期" width="180" />
    <el-table-column prop="currentUse" label="创建人" width="180" />
    <el-table-column prop="updatedAt" label="更新日期" width="180" >
      <template #default="scope">
        {{ moment(scope.row.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
        
      </template>
    </el-table-column>
    <el-table-column label="操作" :width="320" class-name="table-options">
      <template #default="scope">
        <el-button type="primary" text :icon="Edit" @click="() => handleRename(scope.row._id)">重命名</el-button>
        <el-button type="primary" text v-if="scope.row.status === 'recycling'" @click="() => handleClose(scope.row._id)">
          <i class="iconfont icon-icon_guanbi"></i>关闭
        </el-button>
        <el-button type="primary" text v-else @click="() => handleStart(scope.row._id)">
          <i class="iconfont icon-icon_qiyong"></i>启用
        </el-button>
        <el-button type="danger" text :icon="Delete" @click="() => handleDelete(scope.row._id)">删除</el-button>
      </template>

    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination layout="prev, pager, next" :total="channelTotal" @current-change="handleCurrentChange"/>
  </div>
  <ChannelModify :visible="channelModifyVisible" :channel-id="curChannelId" @confirm="handleRenameConfirm" @close="handleRanameClose"/>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia' 
import moment from 'moment'
import { Delete, Edit } from '@element-plus/icons-vue'

import { CHANNEL_TYPE_ICON, CHANNEL_TYPE, CHANNEL_STATUS_TEXT, CHANNEL_STATUS } from '@/management/enums/channel'
import { useChannelStore } from '@/management/stores/channel'
import { useEditStore } from '@/management/stores/edit'

import ChannelModify from './ChannelModify.vue' 

const channelStore = useChannelStore()
const editStore = useEditStore()

const {  channelList, channelTotal } = storeToRefs(channelStore)
const { surveyId } =storeToRefs(editStore)

onMounted(() => {
  channelStore.getChannelList({
    surveyId: surveyId.value,
    curPage: 1
  })
})
const handleCurrentChange = (current: number) => {
  channelStore.getChannelList({
    surveyId: surveyId.value,
    curPage: current
  })
}
const handleDelete = (channelId: string) => {
  ElMessageBox.confirm('确定要删除该投放吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    channelStore.deleteChannel({
      channelId
    })
  }).catch(() => {
    
  })
}
const channelModifyVisible = ref(false)
const curChannelId = ref('')
const handleRename = (channelId: string) => {
  curChannelId.value = channelId
  channelModifyVisible.value = true
}
const handleRenameConfirm = (name: string) => {
  channelStore.updateChannel({
    channelId: curChannelId.value,
    name
  })
  channelModifyVisible.value = false
  curChannelId.value = ''
}
const handleRanameClose = () => {
  channelModifyVisible.value = false
  curChannelId.value = ''
}
const handleClose = (channelId: string) => {
  ElMessageBox.confirm('关闭投放后，将停止问卷回收，是否继续?', '确定要关闭投放吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    channelStore.changeChannelStatus({
      channelId,
      status: CHANNEL_STATUS.PAUSE
    })
  }).catch(() => {
    
  })
}
const handleStart = async (channelId: string) => {
  await channelStore.changeChannelStatus({
    channelId,
    status: CHANNEL_STATUS.RECYCLING
  })
  ElMessage.success('投放已开启')
  
}
</script>
<style lang="scss" scoped>
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.channel_name {
  display: flex;
  align-items: center;
  .channel_icon {
    font-size: 20px;
    margin-right: 8px;
    color: #92949D;
  }
}

</style>
