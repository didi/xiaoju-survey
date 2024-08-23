import { ElMessage } from 'element-plus'
import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: 'nps评分',
  type: 'radio-nps',
  componentName: 'NpsModule',
  attrs: [
    {
      name: 'field',
      propType: 'String',
      description: '这是用于描述题目id',
      defaultValue: ''
    },
    {
      name: 'title',
      propType: 'String',
      description: '这是用于描述题目标题',
      defaultValue: '标题一'
    },
    {
      name: 'type',
      propType: 'String',
      description: '这是用于描述题目类型',
      defaultValue: 'radio-nps'
    },
    {
      name: 'isRequired',
      propType: Boolean,
      description: '是否必填',
      defaultValue: true
    },
    {
      name: 'showIndex',
      propType: Boolean,
      description: '显示序号',
      defaultValue: true
    },
    {
      name: 'showType',
      propType: Boolean,
      description: '显示类型',
      defaultValue: true
    },
    {
      name: 'showSpliter',
      propType: Boolean,
      description: '显示分割线',
      defaultValue: true
    },
    {
      name: 'min',
      propType: Number,
      description: '这是用于描述NPS量表最小值',
      defaultValue: 1
    },
    {
      name: 'max',
      propType: Number,
      description: '这是用于描述NPS量表最大值',
      defaultValue: 10
    },

    {
      name: 'minMsg',
      propType: String,
      description: '这是用于描述最小值文案',
      defaultValue: '极不满意'
    },
    {
      name: 'maxMsg',
      propType: String,
      description: '这是用于描述最大值文案',
      defaultValue: '十分满意'
    },
    {
      name: 'rangeConfig',
      propType: Object,
      description: '这是用于描述评分高级设置',
      defaultValue: {}
    }
  ],
  formConfig: [
    basicConfig,
    {
      name: 'min',
      title: 'NPS量表最小值',
      contentClass: 'nps-select-config',
      key: 'min',
      type: 'SelectSetter',
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => ({
        value: v,
        label: v
      })),
      validate: (val, moduleConfig) => {
        if (moduleConfig['max'] && val >= moduleConfig['max']) {
          ElMessage.info('最小值不可大于最大值')
          return false
        }
        return true
      }
    },
    {
      name: 'max',
      title: 'NPS量表最大值',
      key: 'max',
      type: 'SelectSetter',
      contentClass: 'nps-select-config',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => ({
        value: v,
        label: v
      })),
      validate: (val, moduleConfig) => {
        if (moduleConfig['min'] && val <= moduleConfig['min']) {
          ElMessage.info('最大值不可小于最小值')
          return false
        }
        return true
      }
    },
    {
      name: 'npsMsg',
      title: 'NPS两级文案',
      contentClass: 'nps-customed-config',
      type: 'Customed',
      content: [
        {
          label: '最小值文案',
          type: 'InputSetter',
          key: 'minMsg',
          placeholder: '极不满意',
          value: '极不满意'
        },
        {
          label: '最大值文案',
          type: 'InputSetter',
          key: 'maxMsg',
          placeholder: '十分满意',
          value: '十分满意'
        }
      ]
    }
  ],
  editConfigure: {
    optionEdit: {
      show: false
    },
    optionEditBar: {
      show: true,
      configure: {
        showOthers: false,
        showAdvancedConfig: true
      }
    }
  }
}

export default meta
