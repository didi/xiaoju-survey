<template>
  <el-popover placement="top" trigger="click" @show="onShow">
    <el-tabs v-model="currentTab" class="custom-tab" v-if="visible">
      <el-tab-pane label="修改历史" name="daily" class="custom-tab-pane">
        <div class="line" v-for="(his, index) in dailyList" :key="index">
          <span class="operator">{{ his.operator }}</span>
          <span class="seperator">|</span>
          <span>{{ his.time }}</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="发布历史" name="publish" class="custom-tab-pane">
        <div class="line" v-for="(his, index) in publishList" :key="index">
          <span class="operator">{{ his.operator }}</span>
          <span class="seperator">|</span>
          <span>{{ his.time }}</span>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="btn" slot="reference">
      <i class="iconfont icon-lishi"></i>
      <span class="btn-txt">历史</span>
    </div>
  </el-popover>
</template>
<script>
import { getSurveyHistory } from '@/management/api/survey';
import moment from 'moment';
// 引入中文
import 'moment/locale/zh-cn';
// 设置中文
moment.locale('zh-cn');

import { mapState } from 'vuex';
import { get as _get } from 'lodash-es';

const getItemData = (item) => ({
  operator: item?.operator?.username || '未知用户',
  time: moment(item.createDate).format('YYYY-MM-DD HH:mm:ss'),
});

export default {
  name: 'history',
  computed: {
    ...mapState({
      surveyId: (state) => _get(state, 'edit.surveyId'),
    }),
    dailyList() {
      return this.dailyHis.map(getItemData);
    },
    publishList() {
      return this.publishHis.map(getItemData);
    },
  },
  data() {
    return {
      dailyHis: [],
      publishHis: [],
      currentTab: 'daily',
      visible: false,
    };
  },
  watch: {
    surveyId: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          const [dailyHis, publishHis] = await Promise.all([
            getSurveyHistory({
              surveyId: this.surveyId,
              historyType: 'dailyHis',
            }),
            getSurveyHistory({
              surveyId: this.surveyId,
              historyType: 'publishHis',
            }),
          ]);
          this.dailyHis = dailyHis.data || [];
          this.publishHis = publishHis.data || [];
        }
      },
    },
  },
  methods: {
    onShow() {
      this.visible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
@import url('@/management/styles/edit-btn.scss');
.custom-tab {
  width: 300px;
  ::v-deep .el-tabs__nav {
    width: 100%;

    .el-tabs__item {
      width: 50%;
      text-align: center;
    }
  }
}

.custom-tab-pane {
  width: 275px;
  max-height: 150px;
  overflow-y: auto;
}

.line {
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  transition: all 0.2s;
  color: $font-color;

  .seperator {
    padding: 0 10px;
  }
}
</style>
