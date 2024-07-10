// 问卷相关的Pinia Store
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { isMobile as isInMobile } from '@/render/utils/index'
import {  getEncryptInfo as getEncryptInfoApi } from '@/render/api/survey'

/**
 * CODE_MAP不从management引入，在dev阶段，会导致B端 router被加载，进而导致C端路由被添加 baseUrl: /management
 */
const CODE_MAP = {
  SUCCESS: 200,
  ERROR: 500,
  NO_AUTH: 403
}
export const useSurveyStore = defineStore('survey', () => {
  const surveyPath = ref('');
  const isMobile = ref(isInMobile())
  const enterTime = ref(0)
  const encryptInfo = ref(null)

  const setSurveyPath = ( data) => {
    surveyPath.value = data
  }

  const setEnterTime = () => {
    enterTime.value = Date.now()
  }

  const getEncryptInfo =  async() => {
    try {
      const res = await getEncryptInfoApi()
      if (res.code === CODE_MAP.SUCCESS) {
        encryptInfo.value = res.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    surveyPath,
    isMobile,
    enterTime,
    encryptInfo,

    setSurveyPath,
    setEnterTime,
    getEncryptInfo
  }
})