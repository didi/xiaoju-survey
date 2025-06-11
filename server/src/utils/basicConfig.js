import { pick as _pick } from 'lodash-es'

export default {
  name: 'basicConfig',
  title: '基础配置',
  type: 'CheckboxGroup',
  key: 'basicConfig',
  options: [
    {
      label: '必填',
      key: 'isRequired'
    },
    {
      label: '显示类型',
      key: 'showType'
    },
    {
      label: '显示序号',
      key: 'showIndex'
    },
    {
      label: '显示分割线',
      key: 'showSpliter',
      tip: '题目下方分割线，仅在移动端展示。'
    }
  ],
  valueGetter({ moduleConfig }) {
    return _pick(
      moduleConfig,
      this.options.map((item) => item.key)
    )
  }
}
