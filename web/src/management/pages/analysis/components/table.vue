<template>
  <div class="data-table-wrapper">
    <el-table
      ref="multipleTable"
      :data="tableData.listBody"
      tooltip-effect="dark"
      style="width: 100%"
      header-row-class-name="thead-cell"
      class="table-border"
      show-overflow-tooltip
      v-loading="mainTableLoading"
      element-loading-text="数据处理中，请稍等..."
    >
      <el-table-column
        v-for="item in tableData.listHead"
        :key="item.field"
        :prop="item.field"
        :label="cleanRichText(item.title)"
        minWidth="200"
      >
        <template slot="header" slot-scope="scope">
          <div class="table-row-cell">
            <span slot="reference" v-popover="scope.column.id">
              {{ scope.column.label.replace(/&nbsp;/g, '') }}
            </span>
            <el-popover
              :ref="scope.column.id"
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.column.label.replace(/&nbsp;/g, '')"
            >
            </el-popover>
          </div>
        </template>
        <template slot-scope="scope">
          <span
            slot="reference"
            class="table-row-cell"
            v-popover="scope.$index + scope.column.property"
          >
            {{ getContent(scope.row[scope.column.property]) }}
          </span>
          <el-popover
            :ref="scope.$index + scope.column.property"
            placement="top-start"
            trigger="hover"
            width="300"
            :content="getContent(scope.row[scope.column.property])"
          >
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { cleanRichText } from '@/common/xss';

export default {
  name: 'DataTable',
  data() {
    return {};
  },
  props: {
    mainTableLoading: Boolean,
    tableData: Object,
  },

  methods: {
    cleanRichText,
    getContent(value) {
      const content = cleanRichText(value)

      return content === 0 ? 0 : (content || '未知')
    }
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.data-table-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 20px;
  min-height: 620px;
  background: #fff;
  padding: 10px 20px;
  .table-border {
    box-sizing: border-box;
    text-align: center;
  }
  ::v-deep .el-table__header {
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
    white-space: nowrap; /* 禁止自动换行 */
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 显示省略号 */
  }
}
</style>
