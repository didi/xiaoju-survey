import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useErrorInfo = defineStore('errorInfo', () => {
  const errorInfo = ref({
    errorType: '',
    errorMsg: ''
  })

  const setErrorInfo = ({ errorType, errorMsg }) => {
    errorInfo.value = {
      errorType,
      errorMsg
    }
  }

  return {
    errorInfo,

    setErrorInfo
  }
})
