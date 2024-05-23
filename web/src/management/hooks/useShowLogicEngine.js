import { ref } from 'vue'
import { RuleBuild } from '@/common/logicEngine/RuleBuild'

export const showLogicEngine = ref()
export const initShowLogicEngine = (ruleConf) => {
  showLogicEngine.value = new RuleBuild().fromJson(ruleConf)
}
