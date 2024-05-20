import { RuleMatch } from '@/common/logicEngine/RulesMatch'

export const ruleEngine = new RuleMatch()
export const initRuleEngine = (ruleConf) => {
  ruleEngine.fromJson(ruleConf)
}