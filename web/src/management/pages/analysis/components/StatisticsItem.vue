<template>
  <div class="separate-item">
    <div class="separate-item-title">
      <el-popover
        placement="top"
        width="400"
        trigger="hover"
        :disabled="!titlePoppverShow"
        :content="cleanRichText(StatisticsData.title)"
      >
        <template #reference>
          <p ref="titleRef" class="text" v-html="cleanRichText(StatisticsData.title)"></p>
        </template>
      </el-popover>
      <p v-if="questionTypeDesc" class="type">{{ questionTypeDesc }}</p>
    </div>
    <div class="separate-item-content">
      <div class="chart-wrapper">
        <div ref="chartRef" class="chart"></div>
        <div v-if="chartTypeList.length > 1" class="chart-type-list">
          <el-segmented v-model="chartType" :options="chartTypeList" size="small">
            <template #default="{ item }">
              <i class="iconfont" :class="`icon-${item}`"></i>
            </template>
          </el-segmented>
        </div>
      </div>
      <div class="table-wrapper">
        <data-table :table-data :table-min-height />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, computed, watch, onMounted, onUnmounted, ref } from 'vue'
import { cloneDeep as _cloneDeep } from 'lodash-es'
import {
  separateItemListHead,
  summaryType,
  summaryItemConfig
} from '@/management/config/analysisConfig'
import useCharts from '@/management/hooks/useCharts'
import useStatisticsItemChart from '@/management/hooks/useStatisticsItemChart'
import { cleanRichText } from '@/common/xss'
import { menuItems } from '@/management/config/questionMenuConfig'
import DataTable from './DataTable.vue'
import useResizeObserver from '@/management/hooks/useResizeObserver'

const props = defineProps({
  StatisticsData: {
    type: Object,
    required: true
  }
})

const questionType = computed(() => {
  return props?.StatisticsData?.type
})

const questionTypeDesc = computed(() => {
  return menuItems?.[questionType.value]?.title || ''
})

// 表格数据
const separateItemListBody = computed(() => {
  try {
    const aggregation = _cloneDeep(props?.StatisticsData?.data?.aggregation)
    const submitionCount = props?.StatisticsData?.data?.submitionCount
    const summaryList = summaryItemConfig[questionType.value]
    // 增加聚合信息
    if (summaryList?.length) {
      summaryList.forEach((item, index) => {
        const { type, text, field, max, min } = item
        if (text && field && type === summaryType.between) {
          aggregation.push({
            id: `summary_${index}`,
            text,
            count: aggregation.reduce((n, item) => {
              if (item[field] >= min && item[field] <= max) {
                return n + item.count
              }
              return n
            }, 0)
          })
        }
      })
    }

    return (
      aggregation?.map((item) => {
        const { id, count, text } = item
        const percent = submitionCount ? `${((count / submitionCount) * 100).toFixed(1)}%` : '0%'
        return {
          id,
          count,
          text,
          percent
        }
      }) || []
    )
  } catch (e) {
    console.log(e)
    return []
  }
})

const separateItemState = reactive({
  tableData: {
    total: 0,
    listHead: separateItemListHead,
    listBody: separateItemListBody
  },
  tableMinHeight: '0px'
})

const { tableData, tableMinHeight } = toRefs(separateItemState)

const titlePoppverShow = ref(false)
const titleRef = ref(null)

const titleResize = () => {
  if (titleRef.value?.scrollWidth > titleRef.value?.offsetWidth) {
    titlePoppverShow.value = true
  } else {
    titlePoppverShow.value = false
  }
}

const { chartRef, chartTypeList, chartType, chartData } = useStatisticsItemChart({
  questionType,
  data: props?.StatisticsData?.data
})

onMounted(() => {
  // 需要获取图表dom，所以得在mounted中执行
  const { changeType, resize: chartResize } = useCharts(
    chartRef.value,
    chartType.value,
    chartData.value
  )

  const { destroy } = useResizeObserver(chartRef.value, () => {
    chartResize()
    titleResize()
  })

  // 图型切换
  watch(chartType, () => {
    changeType(chartType.value, chartData.value)
  })

  // 销毁resizeObserver
  onUnmounted(destroy)
})
</script>

<style lang="scss" scoped>
.separate-item {
  padding: 32px 12px;
  border-bottom: 1px solid #efefef;

  &:nth-last-of-type(1) {
    border-bottom: none;
  }

  &-title {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    margin-bottom: 24px;
    display: flex;
    align-items: center;

    .text {
      max-width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .type {
      font-size: 12px;
      margin-left: 8px;
      color: white;
      background-color: var(--primary-color);
      border-radius: 7px 3px;
      padding: 2px 6px;
    }
  }

  &-content {
    display: flex;
    justify-content: space-between;
    gap: 50px;

    .chart-wrapper {
      position: relative;
      flex: auto;
      width: 50%;
      min-width: 300px;
      height: 320px;
      max-width: 1000px;
      box-shadow: 0 2px 8px -2px rgba(136, 136, 157, 0.2);
      border-radius: 2px;
      padding: 24px;

      .chart-type-list {
        position: absolute;
        left: 0;
        top: 0;

        .iconfont {
          font-size: 12px;
        }
      }

      .chart {
        width: 100%;
        height: 100%;
      }
    }

    .table-wrapper {
      flex: auto;
      width: 50%;
      min-width: 300px;
      max-width: 1000px;
    }
  }

  @media screen and (min-width: 1660px) {
    &-content {
      gap: 80px;

      .chart-wrapper {
        height: 400px;
      }
    }
  }
}
</style>
