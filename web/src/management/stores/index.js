import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getBannerData as fetchBannerData } from '@/management/api/skin.js'
import { getCollaboratorPermissions } from '@/management/api/space.ts'
import { CODE_MAP } from '@/management/api/base'
import { SurveyPermissions } from '@/management/utils/types/workSpace'

export const useStore = defineStore('index', () => {
  const bannerList = ref()
  const cooperPermissions = ref(Object.values(SurveyPermissions))


  async function getBannerData() {

    if (bannerList.value?.length > 0) {
      return
    }
    const res = await fetchBannerData()
    if (res.code === 200) {
      bannerList.value = res.data
    }
  }

  async function fetchCooperPermissions(id) {
    const res = await getCollaboratorPermissions(id)
    if (res.code === CODE_MAP.SUCCESS) {
      cooperPermissions.value = res.data.permissions
    }
  }

  return {
    bannerList,
    cooperPermissions,
    getBannerData,
    fetchCooperPermissions,
  }
})