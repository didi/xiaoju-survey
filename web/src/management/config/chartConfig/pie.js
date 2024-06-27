const color = [
  '#55A8FD',
  '#36CBCB',
  '#FAD337',
  '#A6D6FF',
  '#A177DC',
  '#F46C73',
  '#FFBA62',
  '#ACE474',
  '#BEECD6',
  '#AFD2FF'
]
/*
 * @Description: 饼图配置
 * @CreateDate: 2024-04-30
 */
export default (data) => {
  return {
    color,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 12,
      top: 12,
      tooltip: {
        show: true
      },
      formatter(name) {
        return name.length > 17 ? name.substr(0, 17) + '...' : name
      }
    },
    series: [
      {
        name: '提交人数',
        type: 'pie',
        radius: ['50%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter({ data }) {
            const name = data?.name || ''
            return name.length > 17 ? name.substr(0, 17) + '...' : name
          }
        },
        data
      }
    ]
  }
}
