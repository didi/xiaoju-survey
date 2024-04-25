import basicConfig from '../../common/config/basicConfig'

const meta = {
  title: '多行输入框',
  type: 'textarea',
  componentName: 'TextareaModule',
  formConfig: [
    basicConfig,
    {
      name: 'valid',
      title: '内容限制格式',
      type: 'SelectSetter',
      key: 'valid',
      options: [
        {
          label: '请选择',
          value: ''
        },
        {
          label: '手机号',
          value: 'm'
        },
        {
          label: '身份证',
          value: 'idcard'
        },
        {
          label: '数字',
          value: 'n'
        },
        {
          label: '邮箱',
          value: 'e'
        },
        {
          label: '车牌号',
          value: 'licensePlate'
        }
      ]
    },
    {
      name: 'numberRange',
      label: '数字限制',
      type: 'RangeSetter',
      options: [],
      key: 'numberRange',
      value: [],
      cleanKeys: {
        numberRange: {
          min: {
            placeholder: '0',
            value: 0
          },
          max: {
            placeholder: '1000',
            value: 1000
          }
        }
      },
      relyFunc: (data) => data.valid && data.valid === 'n'
    },
    {
      name: 'textRange',
      title: '字数限制',
      type: 'RangeSetter',
      options: [],
      key: 'textRange',
      value: []
    },
    {
      name: 'placeholder',
      title: '引导提示文案',
      type: 'InputSetter',
      placeholder: '限制20字',
      key: 'placeholder',
      tip: '限制20字',
      validate(value) {
        if (value && value.length > 20) {
          return false
        }
        return true
      }
    }
  ]
}
export default meta
