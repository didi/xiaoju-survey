<template>
  <div class="tableview-root">
    <div class="filter-wrap">
      <div class="select">
        <text-select
          v-for="item in Object.keys(selectOptionsDict)"
          :key="item"
          :effect-fun="onSelectChange"
          :effect-key="item"
          :options="selectOptionsDict[item]"
        />
      </div>
      <div class="search">
        <text-button
          v-for="item in Object.keys(buttonOptionsDict)"
          :key="item"
          :effect-fun="onButtonChange"
          :effect-key="item"
          :option="buttonOptionsDict[item]"
          :icon="
            buttonOptionsDict[item].icons.find(
              (iconItem) => iconItem.effectValue === buttonValueMap[item]
            ).name
          "
          size="mini"
          type="text"
        ></text-button>
        <text-search
          placeholder="请输入问卷标题"
          :value="searchVal"
          @search="onSearchText"
        />
      </div>
    </div>
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
      @row-click="onRowClick"
    >
      <el-table-column column-key="space" width="20" />
      <el-table-column
        v-for="field in fieldList"
        :key="field.key"
        :label="field.title"
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
            <span class="cell-span">{{ scope.row[field.key] }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作" :width="300" class-name="table-options">
        <template slot-scope="scope">
          <ToolBar
            :data="scope.row"
            type="list"
            :tools="getToolConfig(scope.row)"
            :tool-width="50"
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
      <empty :data="!searchVal ? noListDataConfig : noSearchDataConfig" />
    </div>

    <modify-dialog
      :type="modifyType"
      :visible="showModify"
      :question-info="questionInfo"
      @on-close-codify="onCloseModify"
    />
  </div>
</template>

<script>
import { get, map } from 'lodash-es';
import moment from 'moment';
// 引入中文
import 'moment/locale/zh-cn';
// 设置中文
moment.locale('zh-cn');
import empty from '@/management/components/empty';
import ModifyDialog from './modify';
import Tag from './tag';
import State from './state';
import ToolBar from './toolBar';
import TextSearch from './textSearch';
import TextSelect from './textSelect';
import TextButton from './textButton';
import {
  fieldConfig,
  noListDataConfig,
  noSearchDataConfig,
  selectOptionsDict,
  buttonOptionsDict,
} from '../config';
import { CODE_MAP } from '@/management/api/base';
import { QOP_MAP } from '@/management/utils/constant';
import { getSurveyList, deleteSurvey } from '@/management/api/survey';

export default {
  name: 'BaseList',
  data() {
    return {
      fields: [
        'type',
        'title',
        'remark',
        'owner',
        'state',
        'createDate',
        'updateDate',
      ],
      showModify: false,
      modifyType: '',
      loading: false,
      noListDataConfig,
      noSearchDataConfig,
      questionInfo: {},
      total: 0,
      data: [],
      currentPage: 1,
      searchVal: '',
      selectOptionsDict,
      selectValueMap: {
        surveyType: '',
        'curStatus.status': '',
      },
      buttonOptionsDict,
      buttonValueMap: {
        'curStatus.date': '',
        createDate: -1,
      },
    };
  },
  computed: {
    fieldList() {
      const fieldInfo = map(this.fields, (f) => {
        return get(fieldConfig, f, null);
      });
      return fieldInfo;
    },
    dataList() {
      return this.data.map((item) => {
        return {
          ...item,
          'curStatus.date': item.curStatus.date,
        };
      });
    },
    filter() {
      return [
        {
          comparator: '',
          condition: [
            {
              field: 'title',
              value: this.searchVal,
              comparator: '$regex',
            },
          ],
        },
        {
          comparator: '',
          condition: [
            {
              field: 'curStatus.status',
              value: this.selectValueMap['curStatus.status'],
            },
          ],
        },
        {
          comparator: '',
          condition: [
            {
              field: 'surveyType',
              value: this.selectValueMap.surveyType,
            },
          ],
        },
      ];
    },
    order() {
      const formatOrder = Object.entries(this.buttonValueMap)
        .filter(([, effectValue]) => effectValue)
        .reduce((prev, item) => {
          const [effectKey, effectValue] = item;
          prev.push({ field: effectKey, value: effectValue });
          return prev;
        }, []);
      return JSON.stringify(formatOrder);
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      try {
        const filter = JSON.stringify(
          this.filter.filter((item) => {
            return item.condition[0].value;
          })
        );
        const res = await getSurveyList({
          curPage: this.currentPage,
          filter,
          order: this.order,
        });
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
    getStatus(data) {
      return get(data, 'curStatus.status', 'new');
    },
    getToolConfig() {
      const funcList = [
        {
          key: QOP_MAP.EDIT,
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
        {
          key: QOP_MAP.COPY,
          label: '复制',
          icon: 'icon-shanchu',
        },
      ];
      return funcList;
    },
    async onDelete(row) {
      try {
        await this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
      } catch (error) {
        console.log('取消删除');
        return;
      }

      const res = await deleteSurvey(row._id);
      if (res.code === CODE_MAP.SUCCESS) {
        this.$message.success('删除成功');
        this.init();
      } else {
        this.$message.error(res.errmsg || '删除失败');
      }
    },
    handleCurrentChange(current) {
      this.currentPage = current;
      this.init();
    },
    onModify(data, type = QOP_MAP.EDIT) {
      this.showModify = true;
      this.modifyType = type;
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
    onSearchText(e) {
      this.searchVal = e;
      this.currentPage = 1;
      this.init();
    },
    onSelectChange(selectValue, selectKey) {
      this.selectValueMap[selectKey] = selectValue;
      this.currentPage = 1;
      this.init();
    },
    onButtonChange(effectValue, effectKey) {
      this.buttonValueMap = {
        'curStatus.date': '',
        createDate: '',
      };
      this.buttonValueMap[effectKey] = effectValue;
      this.init();
    },
  },
  components: {
    empty,
    ModifyDialog,
    Tag,
    ToolBar,
    TextSearch,
    TextSelect,
    TextButton,
    State,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tableview-root {
  .filter-wrap {
    display: flex;
    justify-content: space-between;
    .select {
      display: flex;
    }
    .search {
      display: flex;
      padding-bottom: 20px;
    }
  }

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
.el-select-dropdown__wrap {
  background: #eee;
}
.el-select-dropdown__item.hover {
  background: #fff;
}
</style>
