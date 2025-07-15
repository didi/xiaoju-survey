import type { Ref } from "vue"

export interface ISurveyStore {
  getCurrentSurveySchema(): {
    baseConf: Record<string, any>
  },
  isReady?: Ref<boolean>
}