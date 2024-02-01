<template>
  <div class="analysis-page">
    <leftMenu class="left"></leftMenu>
    <div class="content-wrapper right">
      <template v-if="tableData.total">
        <h2 class="data-list">数据列表</h2>
        <div class="menus">
          <el-switch
            :value="isShowOriginData"
            active-text="是否展示原数据"
            @input="onIsShowOriginChange"
          >
          </el-switch>
        </div>
      </template>

      <template v-if="tableData.total">
        <DataTable
          :main-table-loading="mainTableLoading"
          :table-data="tableData"
        />
        <el-pagination
          background
          layout="prev, pager, next"
          popper-class="analysis-pagination"
          :total="tableData.total"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </template>
      <div v-else>
        <empty :data="noDataConfig" />
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from './components/table.vue';
import empty from '@/management/components/empty';
import leftMenu from '@/management/components/leftMenu.vue';
import { getRecycleList } from '@/management/api/analysis';

export default {
  name: 'analysisPage',
  data() {
    return {
      mainTableLoading: false,
      tableData: {
        total: 0,
        listHead: [],
        listBody: [],
      },
      noDataConfig: {
        title: '暂无数据',
        desc: '您的问卷当前还没有数据，快去回收问卷吧！',
        img: '/imgs/icons/analysis-empty.webp',
      },
      currentPage: 1,
      isShowOriginData: false,
      tmpIsShowOriginData: false,
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    async init() {
      if (!this.$route.params.id) {
        this.$message.error('没有传入问卷参数~');
        return;
      }
      this.mainTableLoading = true;
      try {
        const res = await getRecycleList({
          page: this.currentPage,
          surveyId: this.$route.params.id,
          isShowSecret: !this.tmpIsShowOriginData, // 发起请求的时候，isShowOriginData还没改变，暂存了一个字段
        });

        if (res.code === 200) {
          const listHead = this.formatHead(res.data.listHead);
          this.tableData = { ...res.data, listHead };
          this.mainTableLoading = false;
        }
      } catch (error) {
        this.$message.error('查询回收数据失败，请重试');
      }
    },
    handleCurrentChange(current) {
      if (this.mainTableLoading) {
        return;
      }
      this.currentPage = current;
      this.init();
    },
    formatHead(listHead = []) {
      const head = [];

      listHead.forEach((headItem) => {
        head.push({
          field: headItem.field,
          title: headItem.title,
        });

        if (headItem.othersCode?.length) {
          headItem.othersCode.forEach((item) => {
            head.push({
              field: item.code,
              title: `${headItem.title}-${item.option}`,
            });
          });
        }
      });

      return head;
    },
    async onIsShowOriginChange(data) {
      if (this.mainTableLoading) {
        return;
      }
      // console.log(data)
      this.tmpIsShowOriginData = data;
      await this.init();
      this.isShowOriginData = data;
    },
  },

  components: {
    DataTable,
    empty,
    leftMenu,
  },
};
</script>

<style lang="scss" scoped>
.analysis-page {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .left {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .right {
    width: 100%;
    height: 100%;
    padding-left: 120px;
  }
}

.menus {
  margin-bottom: 20px;
}

.content-wrapper {
  padding: 30px 40px 50px 40px;
  border-radius: 2px;
  background-color: #f6f7f9;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  ::v-deep .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .data-list {
    margin-bottom: 20px;
  }
}
</style>
