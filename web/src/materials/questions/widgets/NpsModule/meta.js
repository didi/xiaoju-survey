import { ElMessage } from 'element-plus'
import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: '评分',
  type: 'radio-nps',
  componentName: 'NpsModule',
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
      valueSetter: (val, moduleConfig) => {
        if (moduleConfig['max'] && val >= moduleConfig['max']) {
          ElMessage.info('最小值不可大于最大值')
          return true
        }
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
      valueSetter: (val, moduleConfig) => {
        if (moduleConfig['min'] && val <= moduleConfig['min']) {
          ElMessage.info('最大值不可小于最小值')
          return true
        }
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
        showAdvancedRateConfig: true
      }
    }
  }
}

export default meta
