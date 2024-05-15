import { ref } from 'vue'
import { RuleMatch } from '@/common/logicEngine/RulesMatch'

export const ruleEngine = ref()
export const initRuleEngine = (ruleConf) => {
    ruleEngine.value = new RuleMatch(ruleConf)
}
export const match = (target, scope, fact) => {
  return ruleEngine.value.match(target, scope, fact)
}