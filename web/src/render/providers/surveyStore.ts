import { useSurveyStore as useSurveyRenderStore } from "@/render/stores/survey";
import type { ISurveyStore } from "../../materials/types";

export const useSurveyStore = (): ISurveyStore => {
  const store = useSurveyRenderStore()
  
  return {
    getCurrentSurveySchema() {
      return {
        baseConf: store.baseConf
      }
    }
  }
}