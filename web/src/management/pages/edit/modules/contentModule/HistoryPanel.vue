<template>
  <el-popover placement="top" trigger="click" @show="handlePopoverShow" :width="320">
    <el-tabs v-model="currentTab" class="custom-tab" v-if="visible" v-loading="loading">
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
<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import moment from 'moment'

import { getSurveyHistory } from '@/management/api/survey'

const getItemData = (item: any) => ({
  operator: item?.operator?.username || '未知用户',
  time: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
})

const dailyList = ref<Array<any>>([])
const publishList = ref<Array<any>>([])
const currentTab = ref<'daily' | 'publish'>('daily')
const visible = ref<boolean>(false)

const editStore = useEditStore()
const { surveyId, schemaUpdateTime } = storeToRefs(editStore)

const queryHistories = async () => {
  if (dirtyMonitor.value) {
    loading.value = true
    dirtyMonitor.value = false

    const [dHis, pHis] = await Promise.all([
      getSurveyHistory({
        surveyId: surveyId.value,
        historyType: 'dailyHis'
      }),
      getSurveyHistory({
        surveyId: surveyId.value,
        historyType: 'publishHis'
      })
    ]).finally(() => {
      loading.value = false
    })

    if ((dHis.data || []).length !== dailyList.value.length) {
      dailyList.value = (dHis.data || []).map(getItemData)
    }

    if ((pHis.data || []).length !== publishList.value.length) {
      publishList.value = (pHis.data || []).map(getItemData)
    }
  }
}

const handlePopoverShow = async () => {
  visible.value = true
  queryHistories()
}
const loading = ref<boolean>(false)
const dirtyMonitor = ref<boolean>(true)

watch(
  schemaUpdateTime,
  () => {
    if (!dirtyMonitor.value) {
      dirtyMonitor.value = true
    }
  },
  {
    immediate: true
  }
)
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
