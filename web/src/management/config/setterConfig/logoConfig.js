export default [
  {
    label: '自定义Logo',
    type: 'InputSetter',
    key: 'logoImage',
    tip: '默认尺寸200px*50px',
    direction: 'horizon',
    labelStyle: { width: '120px' }
  },
  {
    label: 'Logo大小',
    type: 'InputPercent',
    key: 'logoImageWidth',
    tip: '填写宽度百分比，例如30%',
    direction: 'horizon',
    labelStyle: { width: '120px' }
  }
]
