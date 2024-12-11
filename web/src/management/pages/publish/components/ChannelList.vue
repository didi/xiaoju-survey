<template>
  <el-table :data="channelList" style="width: 100%">
    <el-table-column prop="type" label="投放类型" width="180" >
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
    <el-table-column prop="count" label="回收量" width="180" />
    <el-table-column prop="createdAt" label="创建日期" width="180" />
    <el-table-column prop="updatedAt" label="更新日期" width="180" >
      <template #default="scope">
        {{ moment(scope.row.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
        
      </template>
    </el-table-column>
    <el-table-column prop="owner" label="创建人" width="180" />
    <el-table-column label="操作" :width="320" class-name="table-options" fixed="right">
      <template #default="scope">
        <el-button text :icon="Edit">重命名</el-button>
        <el-button text :icon="TurnOff" v-if="scope.row.curStatus.status === 'recycling'">关闭</el-button>
        <el-button text :icon="Open" v-else>启用</el-button>
        <el-button text :icon="Delete">删除</el-button>
      </template>

    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination layout="prev, pager, next" :total="channelTotal" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { storeToRefs } from 'pinia' 
import moment from 'moment'
import { Delete, Edit, Open, TurnOff, Upload } from '@element-plus/icons-vue'

import { DELIVER_TYPE_TEXT, DELIVER_TYPE, DELIVER_STATUS_TEXT, DELIVER_STATUS, type IDeliverDataItem } from '@/management/enums/channel'
import { useChannelStore } from '@/management/stores/channel'

const channelStore = useChannelStore()

const {  channelList, channelTotal } = storeToRefs(channelStore)

onMounted(() => {
  channelStore.getChannelList({
    curPage: 1
  })
})

</script>
<style lang="scss" scoped>
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
