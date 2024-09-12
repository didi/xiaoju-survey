import { computed, unref } from 'vue'
import { useQuestionInfo } from './useQuestionInfo'
import { useEditStore } from '../stores/edit'
import { storeToRefs } from 'pinia'

// 目标题的显示逻辑提示文案
export const useJumpLogicInfo = (field) => {
  const editStore = useEditStore()
  const { jumpLogicEngine } = storeToRefs(editStore)
  const hasJumpLogic = computed(() => {
    const logicEngine = jumpLogicEngine.value
    // 判断该题是否作为了跳转逻辑条件
    const isField = logicEngine?.findTargetsByField(field)?.length > 0
    // 判断该题是否作为了跳转目标
    const isTarget = logicEngine?.findConditionByTarget(field)?.length > 0
    return isField || isTarget
  })
  const getJumpLogicText = computed(() => {
    const logicEngine = jumpLogicEngine.value
    if (!logicEngine) return
    // 获取跳转
    const rules = logicEngine?.findRulesByField(field) || []
    if (!rules) return
    const ruleText = rules.map((rule) => {
      const conditions = rule.conditions.map((condition) => {
        const { getOptionTitle } = useQuestionInfo(condition.field)
        if (condition.operator === 'in') {
          return `<span> 选择了 【${getOptionTitle.value(unref(condition.value)).join('')}】</span>`
        } else if (condition.operator === 'neq') {
          return `<span> 答完题目 </span>`
        }
        return ''
      })
      const { getQuestionTitle } = useQuestionInfo(rule.target)
      return (
        conditions.join('') + `<span> &nbsp;则跳转到 【${getQuestionTitle.value()}】</span> </br>`
      )
    })
    return ruleText.join('')
  })
  return { hasJumpLogic, getJumpLogicText }
}
