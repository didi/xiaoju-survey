<template>
  <el-popover placement="top" trigger="click" @show="onShow" :width="320">
    <el-tabs v-model="currentTab" class="custom-tab" v-if="visible" v-loading="paneLoading">
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
    <template #reference>
      <div class="btn">
        <i class="iconfont icon-lishi"></i>
        <span class="btn-txt">历史</span>
      </div>
    </template>
  </el-popover>
</template>

<script>
import { getSurveyHistory } from '@/management/api/survey'
import moment from 'moment'
// 引入中文
import 'moment/locale/zh-cn'
// 设置中文
moment.locale('zh-cn')

import { mapState } from 'vuex'
import { get as _get } from 'lodash-es'

const getItemData = (item) => ({
  operator: item?.operator?.username || '未知用户',
  time: moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')
})

export default {
  name: 'HistoryPanel',
  computed: {
    ...mapState({
      surveyId: (state) => _get(state, 'edit.surveyId')
    }),
    dailyList() {
      return this.dailyHis.map(getItemData)
    },
    publishList() {
      return this.publishHis.map(getItemData)
    }
  },
  data() {
    return {
      dailyHis: [],
      publishHis: [],
      currentTab: 'daily',
      visible: false,
      paneLoading: false
    }
  },
  watch: {
    visible: {
      async handler(newVal) {
        if (this.visible && newVal) {
          this.fetchHis()
        }
      }
    },
    currentTab: {
      immediate: true,
      async handler(newVal) {
        if (this.visible && newVal) {
          this.fetchHis()
        }
      }
    }
  },
  methods: {
    onShow() {
      this.visible = true
    },
    fetchHis() {
      this.paneLoading = true
      switch (this.currentTab) {
        case 'daily':
          getSurveyHistory({
            surveyId: this.surveyId,
            historyType: 'dailyHis'
          })
            .then((dailyHis) => {
              this.dailyHis = dailyHis.data || []
            })
            .finally(() => {
              this.paneLoading = false
            })
          break

        case 'publish':
          getSurveyHistory({
            surveyId: this.surveyId,
            historyType: 'publishHis'
          })
            .then((publishHis) => {
              this.publishHis = publishHis.data || []
            })
            .finally(() => {
              this.paneLoading = false
            })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('@/management/styles/edit-btn.scss');

.custom-tab {
  width: 300px;

  :deep(.el-tabs__nav) {
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
