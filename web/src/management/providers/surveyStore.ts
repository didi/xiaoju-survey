// import { computed } from "vue";
import { useEditStore } from "@/management/stores/edit";
import type { ISurveyStore } from "../../materials/types";

export const useSurveyStore = (): ISurveyStore => {
  const store = useEditStore()
  
  return {
    getCurrentSurveySchema() {
      return {
        baseConf: store.schema.baseConf
      }
    },
    // isReady: computed(() => !!store.schema?.baseConf?.titleConfig?.mainTitle)
  }
}