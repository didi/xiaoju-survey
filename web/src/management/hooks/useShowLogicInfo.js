import { computed, unref } from 'vue'
import { useQuestionInfo } from './useQuestionInfo'
import { flatten } from 'lodash-es'
import { cleanRichText } from '@/common/xss'
import { useEditStore } from '../stores/edit'
import { storeToRefs } from 'pinia'

// 目标题的显示逻辑提示文案
export const useShowLogicInfo = (field) => {
  const editStore = useEditStore()
  const { showLogicEngine } = storeToRefs(editStore)

  const hasShowLogic = computed(() => {
    const logicEngine = showLogicEngine.value
    // 判断该题是否作为了显示逻辑前置题
    const isField = logicEngine?.findTargetsByField(field)?.length > 0
    // 判断该题是否作为了显示逻辑目标题
    const isTarget = logicEngine?.findConditionByTarget(field)?.length > 0
    return isField || isTarget
  })
  const getShowLogicText = computed(() => {
    const logicEngine = showLogicEngine.value
    // 获取目标题的规则
    const rules = logicEngine?.findConditionByTarget(field) || []

    const conditions = flatten(rules).map((item) => {
      const { getQuestionTitle, getOptionTitle } = useQuestionInfo(item.field)
      return `<span>【 ${cleanRichText(getQuestionTitle.value())}】 选择了 【${getOptionTitle.value(unref(item.value)).join('、')}】</span> <br/>`
    })
    return conditions.length
      ? conditions.join('') + '<span> &nbsp;满足以上全部，则显示本题</span>'
      : ''
  })
  return { hasShowLogic, getShowLogicText }
}
