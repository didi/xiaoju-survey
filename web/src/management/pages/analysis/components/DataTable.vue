<template>
  <div class="data-table-wrapper">
    <el-table
      ref="multipleTable"
      :data="props.tableData.listBody"
      style="width: 100%"
      header-row-class-name="thead-cell"
      class="table-border"
      v-loading="props.mainTableLoading"
      element-loading-text="数据处理中，请稍等..."
    >
      <el-table-column
        v-for="item in props.tableData.listHead"
        :key="item.field"
        :prop="item.field"
        :label="cleanRichText(item.title)"
        minWidth="200"
      >
        <template #header="scope">
          <div
            class="table-row-cell"
            @mouseover="onPopoverRefOver(scope, 'head')"
            :ref="(el) => (popoverRefMap[scope.column.id] = el)"
          >
            <span>
              {{ scope.column.label.replace(/&nbsp;/g, '') }}
            </span>
          </div>
        </template>
        <template #default="scope">
          <div
            class="table-row-cell"
            @mouseover="onPopoverRefOver(scope, 'content')"
            :ref="(el) => (popoverRefMap[scope.$index + scope.column.property] = el)"
          >
            <span>
              {{ getContent(scope.row[scope.column.property]) }}
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-popover
      ref="popover"
      popper-style="text-align: center;font-size: 13px;"
      :virtual-ref="popoverVirtualRef"
      placement="top"
      width="400"
      trigger="hover"
      virtual-triggering
      :content="popoverContent"
    >
    </el-popover>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { cleanRichText } from '@/common/xss'

const props = defineProps({
  tableData: {
    type: Object
  },
  mainTableLoading: {
    type: Boolean
  },
  tableMinHeight: {
    type: String,
    default: '620px'
  }
})
const popoverRefMap = ref({})
const popoverVirtualRef = ref()
const popoverContent = ref('')

const getContent = (value) => {
  const content = cleanRichText(value)
  return content === 0 ? 0 : content || '未知'
}
const setPopoverContent = (content) => {
  popoverContent.value = content
}
const onPopoverRefOver = (scope, type) => {
  let popoverContent
  if (type === 'head') {
    popoverVirtualRef.value = popoverRefMap.value[scope.column.id]
    popoverContent = scope.column.label.replace(/&nbsp;/g, '')
  }
  if (type === 'content') {
    popoverVirtualRef.value = popoverRefMap.value[scope.$index + scope.column.property]
    popoverContent = getContent(scope.row[scope.column.property])
  }
  setPopoverContent(popoverContent)
}
</script>

<style lang="scss" scoped>
.data-table-wrapper {
  position: relative;
  width: 100%;
  min-height: v-bind('tableMinHeight');
  background: #fff;
  padding: 10px 20px;

  .table-border {
    box-sizing: border-box;
    text-align: center;
  }

  :deep(.el-table__header) {
    width: 100%;

    .thead-cell .el-table__cell {
      .cell {
        height: 24px;
        color: #4a4c5b;
        font-size: 14px;
      }
    }
  }

  .table-row-cell {
    max-width: 100%;
    display: inline-block;
    white-space: nowrap;
    /* 禁止自动换行 */
    overflow: hidden;
    /* 超出部分隐藏 */
    text-overflow: ellipsis;
    /* 显示省略号 */
  }
}
:deep(.el-table td.el-table__cell div) {
  font-size: 13px;
}
</style>
