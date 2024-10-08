import { ref } from 'vue'
import { defineStore } from 'pinia'

import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { CODE_MAP } from '@/management/api/base'
import {
  createSpace,
  updateSpace as updateSpaceReq,
  deleteSpace as deleteSpaceReq,
  getSpaceList as getSpaceListReq,
  getSpaceDetail as getSpaceDetailReq,
  createGroup,
  getGroupList as getGroupListReq,
  updateGroup as updateGroupReq,
  deleteGroup as deleteGroupReq
} from '@/management/api/space'

import { SpaceType, GroupType } from '@/management/utils/workSpace'
import { type SpaceDetail, type SpaceItem, type IWorkspace, type IGroup, type GroupItem, } from '@/management/utils/workSpace'


import { useSurveyListStore } from './surveyList'

export const useWorkSpaceStore = defineStore('workSpace', () => {
  // list空间
  const spaceMenus = ref([
    {
      icon: 'icon-wodekongjian',
      name: '我的空间',
      id: GroupType.Personal,
      children: []
    },
    {
      icon: 'icon-tuanduikongjian',
      name: '团队空间',
      id: GroupType.Teamwork,
      children: []
    }
  ])
  const spaceType = ref(SpaceType.Group)
  const groupType = ref(GroupType.Personal)
  const workSpaceId = ref('')
  const spaceDetail = ref<SpaceDetail | null>(null)
  const workSpaceList = ref<SpaceItem[]>([])
  const workSpaceListTotal = ref(0)

  const surveyListStore = useSurveyListStore()

  async function getSpaceList(params = { curPage: 1 }) {
    try {
      const res: any = await getSpaceListReq(params)

      if (res.code === CODE_MAP.SUCCESS) {
        const { list, count } = res.data
        const workSpace = list.map((item: SpaceDetail) => {
          return {
            id: item._id,
            name: item.name
          }
        })
        workSpaceList.value = list
        workSpaceListTotal.value = count
        spaceMenus.value[1].children = workSpace
      } else {
        ElMessage.error('getSpaceList' + res.errmsg)
      }
    } catch (err) {
      ElMessage.error('getSpaceList' + err)
    }
  }

  async function getSpaceDetail(id: string) {
    try {
      const _id = id || workSpaceId.value
      const res: any = await getSpaceDetailReq(_id)
      if (res.code === CODE_MAP.SUCCESS) {
        spaceDetail.value = res.data
      } else {
        ElMessage.error('getSpaceList' + res.errmsg)
      }
    } catch (err) {
      ElMessage.error('getSpaceList' + err)
    }
  }

  function changeGroupType(id: GroupType) {
    groupType.value = id
    spaceType.value = SpaceType.Group
    workSpaceId.value = ''
  }

  function changeSpaceType(id: SpaceType | GroupType) {
    spaceType.value = id as SpaceType
    groupType.value = id as GroupType
  }

  function changeWorkSpace(id: string) {
    workSpaceId.value = id
    surveyListStore.resetSearch()
  }

  async function deleteSpace(id: string) {
    try {
      const res: any = await deleteSpaceReq(id)

      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('删除成功')
      } else {
        ElMessage.error(res.errmsg)
      }
    } catch (err: any) {
      ElMessage.error(err)
    }
  }

  async function updateSpace(params: Required<IWorkspace>) {
    const { _id: workspaceId, name, description, members } = params
    const res: any = await updateSpaceReq({ workspaceId, name, description, members })

    if (res?.code === CODE_MAP.SUCCESS) {
      ElMessage.success('更新成功')
    } else {
      ElMessage.error(res?.errmsg)
    }
  }

  async function addSpace(params: IWorkspace) {
    const { name, description, members } = params
    const res: any = await createSpace({ name, description, members })

    if (res.code === CODE_MAP.SUCCESS) {
      ElMessage.success('添加成功')
    } else {
      ElMessage.error('createSpace  code err' + res.errmsg)
    }
  }

  function setSpaceDetail(data: null | SpaceDetail) {
    spaceDetail.value = data
  }
  
  // 分组
  const groupList = ref<GroupItem[]>([])
  const groupAllList = ref<IGroup[]>([])
  const groupListTotal = ref(0)
  const groupDetail = ref<GroupItem | null>(null)
  async function addGroup(params: IGroup) {
    const { name } = params
    const res: any = await createGroup({ name })

    if (res.code === CODE_MAP.SUCCESS) {
      ElMessage.success('添加成功')
    } else {
      ElMessage.error('createGroup  code err' + res.errmsg)
    }
  }

  async function updateGroup(params: Required<IGroup>) {
    const { _id, name } = params
    const res: any = await updateGroupReq({ _id, name })

    if (res?.code === CODE_MAP.SUCCESS) {
      ElMessage.success('更新成功')
    } else {
      ElMessage.error(res?.errmsg)
    }
  }

  async function getGroupList(params = { curPage: 1 }) {
    try {
      const res: any = await getGroupListReq(params)
      if (res.code === CODE_MAP.SUCCESS) {
        const { list, allList, total } = res.data
        let group = list.map((item: GroupItem) => {
          return {
            id: item._id,
            name: item.name
          }
        })
        group.unshift({
          id: -1, 
          name: '全部' 
        }, {
          id: -2, 
          name: '未分组' 
        })
        allList.unshift({
          _id: '', 
          name: '未分组' 
        })
        groupList.value = list
        groupListTotal.value = total
        spaceMenus.value[0].children = group
        groupAllList.value = allList
      } else {
        ElMessage.error('getGroupList' + res.errmsg)
      }
    } catch (err) {
      ElMessage.error('getGroupList' + err)
    }
  }

  function getGroupDetail(id: string) {
    try {
      const data = groupList.value.find((item: GroupItem) => item._id === id)
      if(data != undefined) {
        groupDetail.value = data
      } else {
        ElMessage.error('groupDetail 未找到分组')
      }
    } catch (err) {
      ElMessage.error('groupDetail' + err)
    }
  }

  function setGroupDetail(data: null | GroupItem) {
    groupDetail.value = data
  }

  async function deleteGroup(id: string) {
    try {
      const res: any = await deleteGroupReq(id)

      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('删除成功')
      } else {
        ElMessage.error(res.errmsg)
      }
    } catch (err: any) {
      ElMessage.error(err)
    }
  }

  return {
    spaceMenus,
    spaceType,
    groupType,
    workSpaceId,
    spaceDetail,
    workSpaceList,
    workSpaceListTotal,
    getSpaceList,
    getSpaceDetail,
    changeSpaceType,
    changeGroupType,
    changeWorkSpace,
    addSpace,
    deleteSpace,
    updateSpace,
    setSpaceDetail,
    groupList,
    groupAllList,
    groupListTotal,
    groupDetail,
    addGroup,
    updateGroup,
    getGroupList,
    getGroupDetail,
    setGroupDetail,
    deleteGroup
  }
})
