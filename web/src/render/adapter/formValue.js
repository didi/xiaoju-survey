// 定义提交的数据结构：{ field1: '', field2: [], field1_hash1: '', }
import { QUESTION_TYPE } from '@/common/typeEnum.ts'
export default function ({ dataConf }) {
  const dataList = dataConf.dataList
  const formValues = {}
  for (const item of dataList) {
    // 题目id
    const key = item.field
    const { extraOptions, options, type, rangeConfig, innerType } = item
    let value = ''

    // if (Array.isArray(extraOptions) || Array.isArray(options)) {
    //   // 有固定选项或者有选项，开启了默认选中第一个
    //   if (checked) {
    //     const firstOption = extraOptions?.[0] || options?.[0]
    //     value = firstOption?.hash || ''
    //   }
    // }

    // 题型是多选，或者子题型是多选（innerType是用于投票）
    if (type === QUESTION_TYPE.CHECKBOX || innerType === QUESTION_TYPE.CHECKBOX) {
      value = value ? [value] : []
    }
    formValues[key] = value

    const allOptions = []
    // 有固定选项
    if (Array.isArray(extraOptions)) {
      allOptions.push(...extraOptions)
    }
    // 有选项
    if (Array.isArray(options)) {
      allOptions.push(...options)
    }
    // 对所有选项遍历
    for (const optionItem of allOptions) {
      if (optionItem.others) {
        // 开启了更多输入框，生成更多输入框的key
        const opKey = `${key}_${optionItem.hash}`
        formValues[opKey] = ''
      }
    }

    // 星级评分开启了更多输入框
    if (rangeConfig && Object.keys(rangeConfig).length > 0) {
      for (const rkey of Object.keys(rangeConfig)) {
        if (rangeConfig[rkey].isShowInput) {
          const rangeKey = `${key}_${rkey}`
          formValues[rangeKey] = ''
        }
      }
    }
  }
  return {
    formValues
  }
}
