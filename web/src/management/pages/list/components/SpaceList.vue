<template>
  <el-table
    ref="multipleListTable"
    class="list-table"
    :data="dataList"
    empty-text="暂无数据"
    row-key="_id"
    header-row-class-name="tableview-header"
    row-class-name="tableview-row"
    cell-class-name="tableview-cell"
    style="width: 100%"
    @row-click="onRowClick"
  >
    <el-table-column column-key="space" width="20" />
    <el-table-column
      v-for="field in fieldList"
      :key="(field as any)?.key"
      :label="(field as any).title"
      :column-key="(field as any).key"
      :width="(field as any).width"
      :min-width="(field as any).width || (field as any).minWidth"
      class-name="link"
    >
      <template #default="scope">
        <template v-if="(field as any).comp">
          <component :is="(field as any).comp" type="table" :value="scope.row" />
        </template>
        <template v-else>
          <span class="cell-span">{{ scope.row[(field as any).key] }}</span>
        </template>
      </template>
    </el-table-column>

    <el-table-column label="操作" :width="300" label-class-name="operation" class-name="table-options">
      <template #default="scope">
        <div class="tool-root" >
          <!-- <el-button text type="primary" class="tool-root-btn-text" :style="{ width: 50 + 'px' }" @click.stop="handleEnter(scope.row)">进入</el-button> -->
          <el-button text type="primary" class="tool-root-btn-text" :style="{ width: 50 + 'px' }" @click.stop="handleModify(scope.row._id)">{{ isAdmin(scope.row._id) ? '修改' : '查看'}}</el-button>
          <el-button text type="primary" class="tool-root-btn-text" :style="{ width: 50 + 'px' }" @click.stop="handleDelete(scope.row._id)" v-if="isAdmin(scope.row._id)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <!-- <div class="list-pagination" v-if="total">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div> -->

  <!-- <div v-else>
    <EmptyIndex :data="!searchVal ? noListDataConfig : noSearchDataConfig" />
  </div> -->
  <SpaceModify
    v-if="showSpaceModify"
    :type="modifyType"
    :visible="showSpaceModify"
    @on-close-codify="onCloseModify"
  />
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { spaceListConfig } from '../config'
import { get, map } from 'lodash-es'
import SpaceModify from './SpaceModify.vue'
import { UserRole } from '@/management/utils/types/workSpace'

  const showSpaceModify = ref(false)
  const modifyType = ref('edit')
  const store = useStore()
  const fields = ['name', 'surveyTotal', 'memberTotal', 'owner', 'createDate']
  const fieldList = computed(() => {
    return  map(fields, (f) => {
      return get(spaceListConfig, f, null)
    })
  })
  const dataList = computed(() => {
    return store.state.list.teamSpaceList
  })
  const isAdmin = (id: string) => {
    return store.state.list.teamSpaceList.find((item : any) => item._id === id)?.currentUserRole === UserRole.Admin
  }
  const onRowClick = () => {
    console.log('onRowClick')
  }
  const handleModify = async (id: string) => {
    await store.dispatch('list/getSpaceDetail', id)
    modifyType.value = 'edit'
    showSpaceModify.value = true
  }

  const handleDelete = async (id: string) => {
    // todo: 确认弹窗
    await store.dispatch('list/deleteSpace', id)
    store.dispatch('list/getSpaceList')
  }
  const onCloseModify = () => {
    showSpaceModify.value = false
    store.dispatch('list/getSpaceList')
  }
  // const handleCurrentChange = (current) => {
  //   this.currentPage = current
  //   this.init()
  // }
</script>
<style lang="scss" scoped>
.tool-root{
  display: flex;
  &:first-child{
    margin-left: -10px;
  }
}
// .operation{
//   width: ;
// }
</style>
