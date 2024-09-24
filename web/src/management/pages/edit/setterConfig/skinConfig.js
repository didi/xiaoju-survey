import bannerConfig from './bannerConfig'
import logoConfig from './logoConfig'

export default [
  {
    name: '头图',
    key: 'bannerConf.bannerConfig',
    formConfigList: bannerConfig
  },
  {
    name: '背景',
    key: 'skinConf.backgroundConf',
    formConfigList: [
      {
        type: 'TabsSetter',
        key: 'type',
        options: [
          {
            label: '图片(<5M)',
            value: 'image'
          },
          {
            label: '颜色',
            value: 'color'
          }
        ]
      },
      {
        label: '背景图片',
        type: 'UploadSingleFile',
        accept: 'image/*',
        limitSize: 5, // 单位MB
        key: 'image',
        relyFunc: (data) => {
          return data.type === 'image'
        }
      },
      {
        label: '背景颜色',
        type: 'ColorPicker',
        key: 'color',
        relyFunc: (data) => {
          return data.type === 'color'
        }
      }
    ]
  },
  {
    name: '主题色',
    key: 'skinConf.themeConf',
    formConfigList: [
      {
        label: '全局应用',
        type: 'ColorPicker',
        key: 'color'
      }
    ]
  },
  {
    key: 'skinConf.contentConf',
    name: '内容区域',
    formConfigList: [
      {
        label: '内容透明度',
        type: 'SliderSetter',
        key: 'opacity'
      }
    ]
  },
  {
    name: '品牌logo',
    key: 'bottomConf',
    formConfigList: logoConfig
  }
]
