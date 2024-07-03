import { CODE_MAP } from '@/management/api/base'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { getSurveyList as getSurveyListReq } from '@/management/api/survey'
import { defineStore } from 'pinia'
import { useTeamSpaceStore } from './teamSpace'
import { ref, computed } from 'vue'

export const useSurveyListStore = defineStore('surveyList', () => {
  const surveyList = ref([])
  const surveyTotal = ref(0)

  const {
    searchVal,
    selectValueMap,
    buttonValueMap,
    listFilter,
    listOrder,
    resetSearch,
    reserSelectValueMap,
    reserButtonValueMap,
    changeSelectValueMap,
    changeButtonValueMap
  } = useSearchSurvey()

  const listSpaceStore = useTeamSpaceStore()
  async function getSurveyList(payload) {
    const filterString = JSON.stringify(
      listFilter.value.filter((item) => {
        return item.condition[0].value
      })
    )
    const orderString = JSON.stringify(listOrder.value)
    try {
      let params = {
        curPage: payload?.curPage || 1,
        pageSize: payload?.pageSize || 10, // 默认一页10条
        filter: filterString,
        order: orderString,
        workspaceId: listSpaceStore.workSpaceId
      }

      const res = await getSurveyListReq(params)
      if (res.code === CODE_MAP.SUCCESS) {
        surveyList.value = res.data.data
        surveyTotal.value = res.data.count
      } else {
        ElMessage.error(res.errmsg)
      }
    } catch (error) {
      ElMessage.error('getSurveyList status' + error)
    }
  }

  return {
    surveyList,
    surveyTotal,
    searchVal,
    selectValueMap,
    buttonValueMap,
    listFliter: listFilter,
    listOrder,
    resetSearch,
    getSurveyList,
    reserSelectValueMap,
    reserButtonValueMap,
    changeSelectValueMap,
    changeButtonValueMap
  }
})

function useSearchSurvey() {
  const searchVal = ref('')
  const selectValueMap = ref({
    surveyType: '',
    'curStatus.status': ''
  })
  const buttonValueMap = ref({
    'curStatus.date': '',
    createDate: -1
  })

  const listFilter = computed(() => {
    return [
      {
        comparator: '',
        condition: [
          {
            field: 'title',
            value: searchVal.value,
            comparator: '$regex'
          }
        ]
      },
      {
        comparator: '',
        condition: [
          {
            field: 'curStatus.status',
            value: selectValueMap.value['curStatus.status']
          }
        ]
      },
      {
        comparator: '',
        condition: [
          {
            field: 'surveyType',
            value: selectValueMap.value.surveyType
          }
        ]
      }
    ]
  })
  const listOrder = computed(() => {
    return Object.entries(buttonValueMap.value)
      .filter(([, effectValue]) => effectValue)
      .reduce((prev, item) => {
        const [effectKey, effectValue] = item
        prev.push({ field: effectKey, value: effectValue })
        return prev
      }, [])
  })

  function reserSelectValueMap() {
    selectValueMap.value = {
      surveyType: '',
      'curStatus.status': ''
    }
  }

  function reserButtonValueMap() {
    buttonValueMap.value = {
      'curStatus.date': '',
      createDate: -1
    }
  }

  function changeSelectValueMap(key, value) {
    selectValueMap.value[key] = value
  }

  function changeButtonValueMap(key, value) {
    buttonValueMap.value[key] = value
  }

  function resetSearch() {
    searchVal.value = ''
    reserSelectValueMap()
    reserButtonValueMap()
  }

  return {
    searchVal,
    selectValueMap,
    buttonValueMap,
    listFilter,
    listOrder,
    resetSearch,
    reserSelectValueMap,
    reserButtonValueMap,
    changeSelectValueMap,
    changeButtonValueMap
  }
}
