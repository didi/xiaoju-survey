import { computed, unref } from 'vue';
import { useQuestionInfo } from './useQuestionInfo'
import { flatten } from 'lodash-es'
import store from '@/management/store'
import { cleanRichText } from '@/common/xss'

// 目标题的显示逻辑提示文案
export const useShowLogicInfo = (field: string) => {
  const hasShowLogic = computed(() => {
    // @ts-ignore
    const logicEngine = store.state.logic.showLogicEngine
    // 判断该题是否作为了显示逻辑前置题
    const isField = logicEngine?.findTargetsByFields(field)?.length > 0
    // 判断该题是否作为了显示逻辑目标题
    const isTarget = logicEngine?.findTargetsByScope(field)?.length > 0
    return isField || isTarget
  })
  const getShowLogicText = computed(() => {
    // @ts-ignore
    const logicEngine = store.state.logic.showLogicEngine
     // 获取目标题的规则
     const rules = logicEngine?.findConditionByTarget(field) || []
     
     const conditions = flatten(rules).map((item:any) => {
      const { getQuestionTitle,  getOptionTitle } = useQuestionInfo(item.field)
      return `<span>【 ${cleanRichText(getQuestionTitle.value())}】 选择了 【${getOptionTitle.value(unref(item.value)).join('、')}】</span> <br/>`
    })
    return conditions.length ?  conditions.join('') + '<span> &nbsp;满足以上全部，则显示本题</span>' :''
  })
  return { hasShowLogic, getShowLogicText }
}