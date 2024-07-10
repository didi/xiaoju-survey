import * as echarts from 'echarts/core'
import { BarChart, PieChart, GaugeChart } from 'echarts/charts'
import {
  TooltipComponent,
  TitleComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getOption } from '@/management/config/chartConfig'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  PieChart,
  GaugeChart,
  CanvasRenderer
])

/**
 * 绘制图表
 * @param {Object} el
 * @param {String} type
 * @param {Array} data
 */
export default (el, type, data) => {
  const chart = echarts.init(el)
  const option = getOption[type](data)

  chart.setOption(option, true)

  const resize = () => {
    chart.resize()
  }

  const changeType = (type, data) => {
    chart.setOption(getOption[type](data), true)
  }

  return { chart, resize, changeType }
}
