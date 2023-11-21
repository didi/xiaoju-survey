<template>
  <div class="tableview-root">
    <el-table
      v-if="total"
      ref="multipleListTable"
      class="list-table"
      :data="data"
      empty-text="暂无数据"
      row-key="_id"
      header-row-class-name="tableview-header"
      row-class-name="tableview-row"
      cell-class-name="tableview-cell"
      style="width: 100%"
      v-loading="loading"
      @row-click="onRowClick"
    >
      <el-table-column column-key="space" width="20" />
      <el-table-column
        v-for="field in fieldList"
        :key="field.key"
        :label="theadDict[field.key]"
        :column-key="field.key"
        :width="field.width"
        :min-width="field.width || field.minWidth"
        class-name="link"
      >
        <template slot-scope="scope">
          <template v-if="field.comp">
            <component :is="field.comp" type="table" :value="scope.row" />
          </template>
          <template v-else>
            <span class="cell-span">{{ lget(scope.row, field) }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作" :width="300" class-name="table-options">
        <template slot-scope="scope">
          <ToolBar
            :data="scope.row"
            type="list"
            :tools="getToolConfig(scope.row)"
            :tool-width="65"
            @on-delete="onDelete"
            @on-modify="onModify"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="list-pagination" v-if="total">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <div v-else>
      <empty :data="noListDataConfig" />
    </div>

    <modify-dialog
      :visible="showModify"
      :question-info="questionInfo"
      @on-close-codify="onCloseModify"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import empty from '@/management/components/empty';
import ModifyDialog from './modify';
import Tag from './tag';
import ToolBar from './toolBar';
import { fieldConfig, thead, noListDataConfig } from '../config';
import { CODE_MAP } from '@/management/api/base';

import { getSurveyList, deleteSurvey } from '@/management/api/survey';

export default {
  name: 'BaseList',
  data() {
    return {
      fields: ['type', 'title', 'remark', 'creator', 'updateDate'],
      showModify: false,
      loading: false,
      theadDict: thead,
      noListDataConfig,
      questionInfo: {},
      total: 0,
      data: [],
      currentPage: 1,
    };
  },
  computed: {
    fieldList() {
      const fieldInfo = _.map(this.fields, (f) => {
        return _.get(fieldConfig, f, null);
      });
      return fieldInfo;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      try {
        const res = await getSurveyList(this.currentPage);
        this.loading = false;
        if (res.code === CODE_MAP.SUCCESS) {
          this.total = res.data.count;
          this.data = res.data.data;
        } else {
          this.$message({
            type: 'error',
            message: res.errmsg,
          });
        }
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
        this.loading = false;
      }
    },
    lget(row, field) {
      const data = _.get(row, field.key);
      if (field.key === 'updateDate') {
        return moment(data).format('YYYY-MM-DD HH:mm:ss');
      }
      return data;
    },
    getStatus(data) {
      return _.get(data, 'curStatus.id', 'new');
    },
    getToolConfig() {
      const funcList = [
        {
          key: 'edit',
          label: '修改',
        },
        {
          key: 'analysis',
          label: '数据',
        },
        {
          key: 'release',
          label: '投放',
        },
        {
          key: 'delete',
          label: '删除',
          icon: 'icon-shanchu',
        },
      ];
      return funcList;
    },
    onDelete(row) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await deleteSurvey(row._id);
          if (res.code === CODE_MAP.SUCCESS) {
            this.$message.success('删除成功');
            this.init();
          }
        })
        .catch(() => {
          console.log('取消删除');
        });
    },
    handleCurrentChange(current) {
      this.currentPage = current;
      this.init();
    },
    onModify(data) {
      this.showModify = true;
      this.questionInfo = data;
    },
    onCloseModify(type) {
      this.showModify = false;
      this.questionInfo = {};
      if (type === 'update') {
        this.init();
      }
    },
    onRowClick(row) {
      this.$router.push({
        name: 'QuestionEditIndex',
        params: {
          id: row._id,
        },
      });
    },
  },
  components: {
    empty,
    ModifyDialog,
    Tag,
    ToolBar,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tableview-root {
  .list-table {
    min-height: 620px;
    padding: 10px 20px;
  }
  .list-pagination {
    margin-top: 20px;
    ::v-deep .el-pagination {
      display: flex;
      justify-content: flex-end;
    }
  }
  ::v-deep .el-table__header {
    .tableview-header .el-table__cell {
      .cell {
        height: 24px;
        color: #4a4c5b;
        font-size: 14px;
      }
    }
  }
  ::v-deep .tableview-row {
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
}
</style>
