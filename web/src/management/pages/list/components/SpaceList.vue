<template>
  <div class="list-wrap">
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

      <el-table-column
        label="操作"
        :width="200"
        label-class-name="operation"
        class-name="table-options"
      >
        <template #default="scope">
          <div class="tool-root">
            <!-- <el-button text type="primary" class="tool-root-btn-text" :style="{ width: 50 + 'px' }" @click.stop="handleEnter(scope.row)">进入</el-button> -->
            <el-button
              text
              type="primary"
              class="tool-root-btn-text"
              :style="{ width: 50 + 'px' }"
              @click.stop="handleModify(scope.row._id)"
              >{{ isAdmin(scope.row._id) ? '管理' : '查看' }}</el-button
            >
            <el-button
              text
              type="primary"
              class="tool-root-btn-text"
              :style="{ width: 50 + 'px' }"
              @click.stop="handleDelete(scope.row._id)"
              v-if="isAdmin(scope.row._id)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
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
import { ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message-box.scss'
import { get, map } from 'lodash-es'
import { spaceListConfig } from '../config'
import SpaceModify from './SpaceModify.vue'
import { UserRole } from '@/management/utils/types/workSpace'

const showSpaceModify = ref(false)
const modifyType = ref('edit')
const store = useStore()
const fields = ['name', 'surveyTotal', 'memberTotal', 'owner', 'createDate']
const fieldList = computed(() => {
  return map(fields, (f) => {
    return get(spaceListConfig, f, null)
  })
})
const dataList = computed(() => {
  return store.state.list.teamSpaceList
})
const isAdmin = (id: string) => {
  return (
    store.state.list.teamSpaceList.find((item: any) => item._id === id)?.currentUserRole ===
    UserRole.Admin
  )
}

const handleModify = async (id: string) => {
  await store.dispatch('list/getSpaceDetail', id)
  modifyType.value = 'edit'
  showSpaceModify.value = true
}

const handleDelete = (id: string) => {
  ElMessageBox.confirm(
    '删除团队后，团队内的问卷将同步被删除，请谨慎考虑！是否确认本次删除？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      await store.dispatch('list/deleteSpace', id)
      await store.dispatch('list/getSpaceList')
    })
    .catch(() => {})
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
.list-wrap {
  padding: 20px;
  background: #fff;
  .list-table {
    :deep(.el-table__header) {
      .tableview-header .el-table__cell {
        .cell {
          height: 24px;
          color: #4a4c5b;
          font-size: 14px;
        }
      }
    }
    :deep(.tableview-row) {
      .tableview-cell {
        padding: 5px 0;
        &.link {
          cursor: pointer;
        }
        .cell .cell-span {
          font-size: 14px;
        }
      }
    }
    .tool-root {
      display: flex;
      &:first-child {
        margin-left: -10px;
      }
      .tool-root-btn-text {
        font-weight: normal !important;
      }
    }
  }
}
</style>
