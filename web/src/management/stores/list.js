import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CODE_MAP } from '@/management/api/base'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { getSurveyList as fetchSurveyList } from '@/management/api/survey'
import { SpaceType } from '@/management/utils/types/workSpace'

import {
  createSpace,
  getSpaceList as fetchSpaceList,
  getSpaceDetail as fetchSpaceDetail,
  updateSpace as fetchUpdateSpace,
  deleteSpace as fetchDeleteSpace
} from '@/management/api/space'


function useSpaceMenus(workSpaceId) {
  const spaceMenus = ref([
    {
      icon: 'icon-wodekongjian',
      name: '我的空间',
      id: SpaceType.Personal
    },
    {
      icon: 'icon-tuanduikongjian',
      name: '团队空间',
      id: SpaceType.Group,
      children: [
        // {
        //   name: '小桔问卷调研团队',
        //   id: 'xxxx',
        // }
      ]
    }
  ])
  const spaceType = ref(SpaceType.Personal)
  const teamSpaceList = ref([])
  const spaceDetail = ref()
  async function getSpaceList() {
    try {
      const res = await fetchSpaceList()

      if (res.code === CODE_MAP.SUCCESS) {
        updateTeamSpaceMenus(res.data.list)
      } else {
        ElMessage.error('fetchSpaceList' + res.errmsg)
      }
    } catch (err) {
      ElMessage.error('fetchSpaceList' + err)
    }
  }

  function updateTeamSpaceMenus(list) {
    teamSpaceList.value = list
    const teamSpace = list.map((item) => {
      return {
        id: item._id,
        name: item.name
      }
    })
    spaceMenus.value[1].children = teamSpace
  }

  async function addSpace(params) {
    const res = await createSpace({
      name: params.name,
      description: params.description,
      members: params.members
    })

    if (res.code === CODE_MAP.SUCCESS) {
      ElMessage.success('添加成功')
    } else {
      ElMessage.error('createSpace  code err' + res.errmsg)
    }
  }

  async function getSpaceDetail(id) {
    try {
      const _workspaceId = id || workSpaceId.value
      const res = await fetchSpaceDetail(_workspaceId)
      if (res.code === CODE_MAP.SUCCESS) {
        spaceDetail.value = res.data
      } else {
        ElMessage.error('fetchSpaceDetail' + res.errmsg)
      }
    } catch (err) {
      ElMessage.error('fetchSpaceDetail' + err)
    }
  }

  async function updateSpace(params) {
    const res = await fetchUpdateSpace({
      workspaceId: params._id,
      name: params.name,
      description: params.description,
      members: params.members
    })

    if (res.code === CODE_MAP.SUCCESS) {
      ElMessage.success('更新成功')
    } else {
      ElMessage.error(res.errmsg)
    }
  }

  function changeSpaceType(type) {
    spaceType.value = type
  }

  async function deleteSpace(workspaceId) {
    try {
      const res = await fetchDeleteSpace(workspaceId)

      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('删除成功')
      } else {
        ElMessage.error(res.errmsg)
      }
    } catch (err) {
      ElMessage.error(err)
    }
  }

  return {
    spaceMenus,
    spaceType,
    teamSpaceList,
    spaceDetail,
    getSpaceList,
    addSpace,
    getSpaceDetail,
    updateSpace,
    changeSpaceType,
    deleteSpace
  }
}

function useSurveyList(workSpaceId) {
  const buttonValueMap = ref({
    'curStatus.date': '',
    createDate: -1
  })

  const searchVal = ref('')
  const selectValueMap = ref({
    surveyType: '',
    'curStatus.status': ''
  })

  const surveyList = ref([])
  const surveyTotal = ref(0)

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

  async function getSurveyList(data) {
    const filterString = JSON.stringify(
      listFilter.value.filter((item) => {
        return item.condition[0].value
      })
    )
    const orderString = JSON.stringify(listOrder.value)
    try {
      let params = {
        curPage: data?.curPage || 1,
        pageSize: data?.pageSize || 10, // 默认一页10条
        filter: filterString,
        order: orderString,
        workspaceId: workSpaceId.value
      }
      // if(payload?.order) {
      //   params.order = payload.order
      // }
      // if(payload.filter) {
      //   params.filter = payload.filter
      // }
      // if(payload?.workspaceId) {
      //   params.workspaceId = payload.workspaceId
      // }
      const res = await fetchSurveyList(params)
      if (res.code === CODE_MAP.SUCCESS) {
        const { data, count } = res.data
        console.log(data, count)
        surveyList.value = data
        surveyTotal.value = count
      } else {
        ElMessage.error(res.errmsg)
      }
    } catch (error) {
      ElMessage.error('getSurveyList status' + error)
    }
  }


  function changeSelectValueMap({ key, value }) {
    selectValueMap.value[key] = value
  }

  function changeButtonValueMap({ key, value }) {
    buttonValueMap.value[key] = value
  }

  function resetButtonValueMap() {
    buttonValueMap.value = {
      'curStatus.date': '',
      createDate: -1
    }
  }

  function resetValue() {
    selectValueMap.value = {
      surveyType: '',
      'curStatus.status': ''
    }
    buttonValueMap.value = {
      'curStatus.date': '',
      createDate: -1
    }
    searchVal.value = ''
  }

  return {
    searchVal,
    selectValueMap,
    buttonValueMap,
    surveyList,
    surveyTotal,
    listFilter,
    listOrder,
    getSurveyList,
    changeSelectValueMap,
    changeButtonValueMap,
    resetButtonValueMap,
    resetValue
  }
}

export const useListStore = defineStore('list', () => {
  const workSpaceId = ref('')

  // 菜单相关
  const { spaceMenus,
    spaceType,
    teamSpaceList,
    spaceDetail,
    getSpaceList,
    addSpace,
    getSpaceDetail,
    updateSpace,
    changeSpaceType,
    deleteSpace } = useSpaceMenus(workSpaceId)

  // 列表相关
  const { searchVal,
    selectValueMap,
    buttonValueMap,
    surveyList,
    surveyTotal,
    listFilter,
    listOrder,
    getSurveyList,
    changeSelectValueMap,
    changeButtonValueMap,
    resetButtonValueMap,
    resetValue } = useSurveyList(workSpaceId)

  function changeWorkSpace(id) {
    workSpaceId.value = id
    resetValue()
  }


  return {
    spaceMenus,
    spaceDetail,
    teamSpaceList,
    searchVal,
    getSpaceList,
    addSpace,
    getSpaceDetail,
    updateSpace,
    deleteSpace,
    spaceType,
    changeSpaceType,
    workSpaceId,
    changeWorkSpace,
    selectValueMap,
    changeSelectValueMap,
    buttonValueMap,
    changeButtonValueMap,
    resetButtonValueMap,
    surveyList,
    surveyTotal,
    listFilter,
    listOrder,
    getSurveyList
  }
})
