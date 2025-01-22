import { ref } from 'vue'
import { defineStore } from 'pinia'

import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { CODE_MAP } from '@/management/api/base'
import {
  createChannel as createChannelReq,
  updateChannel as updateChannelReq,
  changeChannelStatus as changeChannelStatusReq,
  deleteChannel as deleteChannelReq,
  getChannelList as getChannelListReq,
} from '@/management/api/channel'
import { CHANNEL_TYPE_TEXT, CHANNEL_TYPE, CHANNEL_STATUS_TEXT, type IDeliverDataItem } from '@/management/enums/channel'

import { useEditStore } from '@/management/stores/edit' 
import { storeToRefs  } from 'pinia'

const editStore = useEditStore()
const { surveyId } = storeToRefs(editStore)

export const useChannelStore = defineStore('channel', () => {
  const channelList = ref<IDeliverDataItem[]>([])
  const channelTotal = ref(0)
  async function getChannelList(params = { surveyId: surveyId.value, curPage: 1 }) {
    try {
      const res: any = await getChannelListReq(params)

      if (res.code === CODE_MAP.SUCCESS) {
        const { list, total } = res.data
        channelList.value = list
        channelTotal.value = total
      } else {
        ElMessage.error('getChannelList' + res.errmsg)
      }
    } catch (err) {
      ElMessage.error('getChannelList' + err)
    }
  }

  async function createChannel(payload: any) {
    try {
      const res: any = await createChannelReq(payload)

      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('创建成功')
        getChannelList()
      } else {
        ElMessage.error('创建失败' + res.errmsg)
      }
    } catch (err) {
      ElMessage.error('创建失败' + err)
    }
  }

  async function deleteChannel(payload: any) {
    try {
      const res: any = await deleteChannelReq(payload)

      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('删除成功')
        getChannelList()
      } else {
        ElMessage.error('删除失败' + res.errmsg)
      }
    } catch (err) {
      ElMessage.error('删除失败' + err)
    }
  }

   const updateChannel = async ({ channelId, name }: any) => {
    try {
      await updateChannelReq({ channelId, name })
      getChannelList()
    } catch (err) {
      ElMessage.error('删除失败' + err)
    }
    
  }
  const changeChannelStatus = async ({channelId, status} : any) => {
    try {
      await changeChannelStatusReq(channelId, status)
      getChannelList()
    } catch (err) {
      ElMessage.error('删除失败' + err)
    }
  } 
  return {
    channelList,
    channelTotal,
    getChannelList,
    createChannel,
    updateChannel,
    deleteChannel,
    changeChannelStatus
  }
})