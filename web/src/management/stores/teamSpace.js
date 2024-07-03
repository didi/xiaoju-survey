import {
  createSpace,
  updateSpace as updateSpaceReq,
  deleteSpace as deleteSpaceReq,
  getSpaceList as getSpaceListReq,
  getSpaceDetail as getSpaceDetailReq
} from '@/management/api/space'
import { CODE_MAP } from '@/management/api/base'
import { SpaceType } from '@/management/utils/types/workSpace'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useSurveyListStore } from './surveyList'

export const useTeamSpaceStore = defineStore('teamSpace', () => {
  // list空间
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
      children: []
    }
  ])
  const spaceType = ref(SpaceType.Personal)
  const workSpaceId = ref('')
  const spaceDetail = ref(null)
  const teamSpaceList = ref([])

  const surveyListStore = useSurveyListStore()

  async function getSpaceList() {
    try {
      const res = await getSpaceListReq()

      if (res.code === CODE_MAP.SUCCESS) {
        const { list } = res.data
        const teamSpace = list.map((item) => {
          return {
            id: item._id,
            name: item.name
          }
        })
        teamSpaceList.value = list
        spaceMenus.value[1].children = teamSpace
      } else {
        ElMessage.error('getSpaceList' + res.errmsg)
      }
    } catch (err) {
      ElMessage.error('getSpaceList' + err)
    }
  }

  async function getSpaceDetail(id) {
    try {
      const _id = id || workSpaceId.value
      const res = await getSpaceDetailReq(_id)
      if (res.code === CODE_MAP.SUCCESS) {
        spaceDetail.value = res.data
      } else {
        ElMessage.error('getSpaceList' + res.errmsg)
      }
    } catch (err) {
      ElMessage.error('getSpaceList' + err)
    }
  }

  function changeSpaceType(id) {
    spaceType.value = id
  }

  function changeWorkSpace(id) {
    console.log('changeWorkSpace =>', id)
    workSpaceId.value = id
    surveyListStore.resetSearch()
  }

  async function deleteSpace(id) {
    try {
      const res = await deleteSpaceReq(id)

      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('删除成功')
      } else {
        ElMessage.error(res.errmsg)
      }
    } catch (err) {
      ElMessage.error(err)
    }
  }

  async function updateSpace(params) {
    const res = await updateSpaceReq({
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

  function setSpaceDetail(data) {
    spaceDetail.value = data
  }

  return {
    spaceMenus,
    spaceType,
    workSpaceId,
    spaceDetail,
    teamSpaceList,
    getSpaceList,
    getSpaceDetail,
    changeSpaceType,
    changeWorkSpace,
    addSpace,
    deleteSpace,
    updateSpace,
    setSpaceDetail
  }
})
