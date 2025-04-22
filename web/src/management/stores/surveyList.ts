import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { CODE_MAP } from '@/management/api/base'
import { getSurveyList as getSurveyListReq } from '@/management/api/survey'
import { useWorkSpaceStore } from './workSpace'

import { curStatus, subStatus, curStatusKey, subStatusKey } from '@/management/config/listConfig'

const verdictStatus = (status: never) => {
  if (curStatus[status]) return curStatusKey
  if (subStatus[status]) return subStatusKey
  return curStatusKey
}

function useSearchSurvey() {
  const searchVal = ref('')
  const selectValueMap = ref<Record<string, any>>({
    surveyType: '',
    status: ''
  })

  const buttonValueMap = ref<Record<string, any>>({
    updatedAt: '',
    createdAt: -1
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
            field: verdictStatus(selectValueMap.value['status'] as never),
            value: selectValueMap.value['status']
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
      .reduce((prev: { field: string; value: string | number }[], item) => {
        const [effectKey, effectValue] = item
        prev.push({ field: effectKey, value: effectValue })
        return prev
      }, [])
  })

  function resetSelectValueMap() {
    selectValueMap.value = {
      surveyType: '',
      status: ''
    }
  }

  function resetButtonValueMap() {
    buttonValueMap.value = {
      updatedAt: '',
      createdAt: -1
    }
  }

  function changeSelectValueMap(key: string, value: string | number) {
    selectValueMap.value[key] = value
  }

  function changeButtonValueMap(key: string, value: string | number) {
    buttonValueMap.value[key] = value
  }

  function resetSearch() {
    searchVal.value = ''
    resetSelectValueMap()
    resetButtonValueMap()
  }

  return {
    searchVal,
    selectValueMap,
    buttonValueMap,
    listFilter,
    listOrder,
    resetSearch,
    resetSelectValueMap,
    resetButtonValueMap,
    changeSelectValueMap,
    changeButtonValueMap
  }
}

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
    resetSelectValueMap,
    resetButtonValueMap,
    changeSelectValueMap,
    changeButtonValueMap
  } = useSearchSurvey()

  const workSpaceStore = useWorkSpaceStore()
  async function getSurveyList(payload: { curPage?: number; pageSize?: number; recycle?: boolean; extraOrder?: any }) {
    const originalListFilter = listFilter.value;

    let tempListFilter = [...originalListFilter];

    const extraFilter = {
        comparator: payload.recycle ? '$eq' : '$ne',
        condition: [{
          field: 'curStatus.status',
          comparator: payload.recycle ? '$eq' : '$ne',
          value: 'removed',
        }]
    };
    tempListFilter.push(extraFilter);

    const filteredList = tempListFilter.filter((item) => {
      return item.condition[0].value;
    });

    const filterString = JSON.stringify(filteredList);
    const order = payload.extraOrder || listOrder.value;
    const orderString = JSON.stringify(order);

    try {
      const params = {
        curPage: payload?.curPage || 1,
        pageSize: payload?.pageSize || 10, // 默认一页10条
        filter: filterString,
        order: orderString,
        workspaceId: workSpaceStore.workSpaceId,
        groupId: workSpaceStore.groupId
      }

      const res: any = await getSurveyListReq(params)
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
    listFilter: listFilter,
    listOrder,
    resetSearch,
    getSurveyList,
    resetSelectValueMap,
    resetButtonValueMap,
    changeSelectValueMap,
    changeButtonValueMap
  }
})
