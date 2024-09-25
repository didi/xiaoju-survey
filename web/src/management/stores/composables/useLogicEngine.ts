import { ref, toRef } from 'vue'
import { RuleBuild } from '@/common/logicEngine/RuleBuild'

export default function useLogicEngine(schema: any) {
  const logicConf = toRef(schema, 'logicConf')
  const showLogicEngine = ref()
  const jumpLogicEngine = ref()
  function initShowLogicEngine() {
    showLogicEngine.value = new RuleBuild().fromJson(logicConf.value?.showLogicConf)
  }
  function initJumpLogicEngine() {
    jumpLogicEngine.value = new RuleBuild().fromJson(logicConf.value?.jumpLogicConf)
  }
  return {
    showLogicEngine,
    jumpLogicEngine,
    initShowLogicEngine,
    initJumpLogicEngine
  }
}
