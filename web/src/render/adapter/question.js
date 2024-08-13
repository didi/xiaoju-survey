/**
 * 处理单题的配置
 */

import { get as _get } from 'lodash-es'

export default function (questionConfig) {
  let dataList = _get(questionConfig, 'dataConf.dataList')
  // 将题目列表转成对象，并且对题目类型、题目的选项做一些字段的增加和转换
  const questionData = dataList.reduce((pre, item, index) => {
    Object.assign(pre, {
      [item.field]: {
        indexNumber: '',
        voteTotal: 0,
        index,
        ...item
      }
    })
    return pre
  }, {})

  return {
    questionData
  }
}
