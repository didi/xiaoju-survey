import basicConfig from '../../common/config/basicConfig'

const meta = {
  title: '投票',
  type: 'vote',
  componentName: 'VoteModule',
  formConfig: [
    basicConfig,
    {
      name: 'optionConfig',
      title: '选项配置',
      type: 'Customed',
      key: 'optionConfig',
      content: [
        {
          label: '设置为多选题',
          type: 'CheckBox',
          key: 'innerType',
          value: false,
          // 输入转换
          valueAdapter({ moduleConfig }) {
            if (moduleConfig.innerType === 'checkbox') {
              return true
            } else {
              return false
            }
          },
          // 输出转换
          setterAdapter({ value }) {
            return {
              key: 'innerType',
              value: value ? 'checkbox' : 'radio'
            }
          }
        },
        {
          label: '至少选择数',
          type: 'InputNumber',
          key: 'minNum',
          value: '',
          min: 0,
          max: 'maxNum',
          contentClass: 'input-number-config'
        },
        {
          label: '最多选择数',
          type: 'InputNumber',
          key: 'maxNum',
          value: '',
          min: 'minNum',
          contentClass: 'input-number-config'
        }
      ]
    }
  ],
  editConfigure: {
    optionEdit: {
      show: true
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
