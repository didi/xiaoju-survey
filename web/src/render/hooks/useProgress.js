import { useSurveyStore } from '../stores/survey'
import { computed } from 'vue'
export const useProgressBar = () => {
  const surveyStore = useSurveyStore()
  const isVariableEmpty = (variable) => {
    if (variable === undefined || variable === null) {
      return true
    }
    if (typeof variable === 'string' && variable.trim() === '') {
      return true
    }
    if (Array.isArray(variable) && variable.length === 0) {
      return true
    }
    if (typeof variable === 'object' && Object.keys(variable).length === 0) {
      return true
    }
    return false
  }

  const surveySchedule = computed(() => {
    let data = {
      fillCount: 0,
      topicCount: 0
    }
    const formValues = surveyStore.formValues
    for (let key in formValues) {
      if (key.split('_').length > 1) continue

      data.topicCount++
      if (!isVariableEmpty(formValues[key])) {
        data.fillCount++
      }
    }

    return data
  })

  const percent = computed(() => {
    const { fillCount, topicCount } = surveySchedule.value
    return (Math.floor((100 / topicCount) * fillCount) || 0) + '%'
  })

  return { surveySchedule, percent }
}
