/**
 * @Description: 柱状图配置
 * @CreateDate: 2024-04-30
 */
export default (data) => {
  const xAxisData = data.map((item) => item.name)
  return {
    color: ['#55A8FD'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{a} <br/>{b}: {c}'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: xAxisData,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0,
          formatter(value) {
            return value
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      }
    ],
    series: [
      {
        showAllSymbol: true,
        name: '提交人数',
        type: 'bar',
        barMaxWidth: 50,
        data
      }
    ]
  }
}
