import { ref } from 'vue'
import { defineStore } from 'pinia'

import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { CODE_MAP } from '@/management/api/base'
import {
  createChannel as createChannelReq,
  updateChannel as updateChannelReq,
  deleteChannel as deleteChannelReq,
  getChannelList as getChannelListReq,
} from '@/management/api/channel'
import { DELIVER_TYPE_TEXT, DELIVER_TYPE, DELIVER_STATUS_TEXT, type IDeliverDataItem } from '@/management/enums/channel'

export const useChannelStore = defineStore('channel', () => {
  const channelList = ref<IDeliverDataItem[]>([])
  const channelTotal = ref(0)
  async function getChannelList(params = { curPage: 1 }) {
      try {
        const res: any = await getChannelListReq(params)
  
        if (res.code === CODE_MAP.SUCCESS) {
          const { list, total } = res.data
          channelList.value = list
          channelTotal.value = total
        } else {
          ElMessage.error('getSpaceList' + res.errmsg)
        }
      } catch (err) {
        ElMessage.error('getSpaceList' + err)
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
  return {
    channelList,
    channelTotal,
    getChannelList,
    createChannel
  }
})