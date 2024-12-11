<template>
  <el-table :data="channelList" style="width: 100%">
    <el-table-column prop="_id" label="渠道ID" width="230" />
    <el-table-column prop="type" label="投放类型" width="160" >
      <template #default="scope">
        <el-tag>{{ DELIVER_TYPE_TEXT[scope.row.type as DELIVER_TYPE] }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="投放名称" width="180" />
    <el-table-column prop="curStatus" label="状态" >
      <template #default="scope">
        <el-tag :type="scope.row.curStatus.status === 'recycling' ? 'success' : 'danger'">{{ DELIVER_STATUS_TEXT[scope.row.curStatus.status as DELIVER_STATUS] }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="count" label="回收量" />
    <el-table-column prop="createdAt" label="创建日期" width="180" />
    <el-table-column prop="updatedAt" label="更新日期" width="180" >
      <template #default="scope">
        {{ moment(scope.row.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
        
      </template>
    </el-table-column>
    <!-- <el-table-column prop="owner" label="创建人" width="180" /> -->
    <el-table-column label="操作" :width="320" class-name="table-options" fixed="right">
      <template #default="scope">
        <el-button type="primary" text :icon="Edit" @click="() => handleRename(scope.row._id)">重命名</el-button>
        <el-button type="warning" text :icon="TurnOff" v-if="scope.row.curStatus.status === 'recycling'" @click="() => handleClose(scope.row._id)">关闭</el-button>
        <el-button type="success" text :icon="Open" v-else @click="() => handleStart(scope.row._id)">启用</el-button>
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
import { Delete, Edit, Open, TurnOff, Upload } from '@element-plus/icons-vue'

import { DELIVER_TYPE_TEXT, DELIVER_TYPE, DELIVER_STATUS_TEXT, DELIVER_STATUS, type IDeliverDataItem } from '@/management/enums/channel'
import { useChannelStore } from '@/management/stores/channel'
import ChannelModify from './ChannelModify.vue' 

const channelStore = useChannelStore()

const {  channelList, channelTotal } = storeToRefs(channelStore)

onMounted(() => {
  channelStore.getChannelList({
    curPage: 1
  })
})
const handleCurrentChange = (current: number) => {
  channelStore.getChannelList({
    curPage: current
  })
}
const handleDelete = (channelId: string) => {
  channelStore.deleteChannel({
    channelId
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
      status: DELIVER_STATUS.PAUSE
    })
  }).catch(() => {
    
  })
}
const handleStart = async (channelId: string) => {
  await channelStore.changeChannelStatus({
    channelId,
    status: DELIVER_STATUS.RECYCLING
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
</style>
