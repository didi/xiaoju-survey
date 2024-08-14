import question from './question'
import rules from './rules'
import questionSeq from './questionSeq'
import formValue from './formValue'

const adapter = (() => {
  const list = []

  const exec = (questionData) => {
    return list.reduce((pre, next, index) => ({ ...pre, index, ...next(questionData, pre) }), {})
  }

  return {
    add(fun) {
      list.push(fun)
    },
    exec,
    // 部分问卷需要依赖一些异步的数据
    generateData(questionData) {
      return exec(questionData)
    }
  }
})()

adapter.add(question)
adapter.add(rules)
adapter.add(questionSeq)
adapter.add(formValue)

// 对
export default adapter
