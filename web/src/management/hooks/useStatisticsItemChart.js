import { ref, watchEffect } from 'vue'
import { cleanRichText } from '@/common/xss'
import { questionChartsConfig } from '../config/analysisConfig'

// 饼图数据处理
const pie = (data) => {
  const aggregation = data?.aggregation
  return (
    aggregation?.map?.((item) => {
      const { id, count, text } = item
      return {
        id,
        value: count,
        name: cleanRichText(text)
      }
    }) || []
  )
}
// 柱状图数据处理
const bar = (data) => {
  const aggregation = data?.aggregation
  return (
    aggregation?.map?.((item) => {
      const { id, count, text } = item
      return {
        id,
        value: count,
        name: cleanRichText(text)
      }
    }) || []
  )
}
// 仪表盘数据处理
const gauge = (data) => {
  return parseFloat(data?.summary?.nps) || 0
}

const dataFormateConfig = {
  pie,
  bar,
  gauge
}

/**
 * @description: 分题统计图表hook
 * @param {*} chartType
 * @param {*} data
 * @return {*} chartRef 图表实例 chartTypeList 图表类型列表 chartType 图表类型 chartData 图表数据
 */
export default ({ questionType, data }) => {
  const chartRef = ref(null)
  const chartTypeList = ref([])
  const chartType = ref('')
  const chartData = ref({})

  watchEffect(() => {
    if (questionType.value) {
      // 根据题型获取图表类型列表
      chartTypeList.value = questionChartsConfig[questionType.value] || questionChartsConfig.default
      if (!chartType.value) {
        // 默认选中第一项
        chartType.value = chartTypeList.value?.[0]
      }
      if (chartType.value) {
        // 根据图表类型获取图表数据
        chartData.value = dataFormateConfig[chartType.value](data)
      }
    }
  })

  return {
    chartRef,
    chartTypeList,
    chartType,
    chartData
  }
}
