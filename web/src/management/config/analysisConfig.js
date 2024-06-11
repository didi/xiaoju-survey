import { menuItems } from './questionMenuConfig'

export const noDataConfig = {
  title: '暂无数据',
  desc: '您的问卷当前还没有数据，快去回收问卷吧！',
  img: '/imgs/icons/analysis-empty.webp'
}

export const separateItemListHead = [
  {
    title: '选项',
    field: 'text'
  },
  {
    title: '数量',
    field: 'count'
  },
  {
    title: '占比',
    field: 'percent'
  }
]

// 图表名称需要和./chartConfig.js中保持一致
export const questionChartsConfig = {
  [menuItems['checkbox']['type']]: ['bar'],
  [menuItems['radio-nps']['type']]: ['gauge', 'pie', 'bar'],
  default: ['pie', 'bar']
}

export const analysisTypeMap = {
  dataTable: 'dataTable',
  separateStatistics: 'separateStatistics'
}

export const analysisType = [
  {
    value: analysisTypeMap.dataTable,
    label: '数据列表',
    icon: 'icon-shujuliebiao'
  },
  {
    value: analysisTypeMap.separateStatistics,
    label: '分题统计',
    icon: 'icon-fentitongji'
  }
]

export const summaryType = {
  between: 'between'
}

export const summaryItemConfig = {
  'radio-nps': [
    {
      text: '推荐者',
      field: 'id',
      type: summaryType.between,
      max: 10,
      min: 9
    },
    {
      text: '中立者',
      field: 'id',
      type: summaryType.between,
      max: 8,
      min: 7
    },
    {
      text: '贬损者',
      field: 'id',
      type: summaryType.between,
      max: 6,
      min: 0
    }
  ]
}
