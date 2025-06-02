import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { CODE_MAP } from '@/management/api/base'
import {
  getRecycleBinList,
  restoreSurvey,
  permanentDeleteSurvey,
  moveToRecycleBin
} from '@/management/api/recycleBin'
import type { RecycleBinItem } from '@/management/utils/workSpace'
import { useWorkSpaceStore } from './workSpace'

export const useRecycleBinStore = defineStore('recycleBin', () => {
  // 回收站问卷列表
  const recycleBinList = ref<RecycleBinItem[]>([])
  const recycleBinTotal = ref(0)
  
  // 获取回收站问卷列表
  async function getRecycleList(params = { curPage: 1, pageSize: 10 }) {
    try {
      const res: any = await getRecycleBinList(params)
      
      if (res.code === CODE_MAP.SUCCESS) {
        const { list, count } = res.data
        recycleBinList.value = list
        recycleBinTotal.value = count
        return { list, count }
      } else {
        ElMessage.error('获取回收站列表失败: ' + res.errmsg)
        return { list: [], count: 0 }
      }
    } catch (err) {
      ElMessage.error('获取回收站列表失败: ' + err)
      return { list: [], count: 0 }
    }
  }
  
  // 恢复问卷
  async function restoreSurveyById(id: string) {
    try {
      const res: any = await restoreSurvey(id)
      
      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('问卷已恢复')
        // 从列表中移除该问卷
        recycleBinList.value = recycleBinList.value.filter(item => item._id !== id)
        recycleBinTotal.value--
        
        // 更新回收站菜单数量
        const workSpaceStore = useWorkSpaceStore()
        workSpaceStore.updateRecycleBinCount()
        
        return true
      } else {
        ElMessage.error('恢复问卷失败: ' + res.errmsg)
        return false
      }
    } catch (err) {
      ElMessage.error('恢复问卷失败: ' + err)
      return false
    }
  }
  
  // 永久删除问卷
  async function deleteSurveyPermanently(id: string) {
    try {
      const res: any = await permanentDeleteSurvey(id)
      
      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('问卷已永久删除')
        // 从列表中移除该问卷
        recycleBinList.value = recycleBinList.value.filter(item => item._id !== id)
        recycleBinTotal.value--
        
        // 更新回收站菜单数量
        const workSpaceStore = useWorkSpaceStore()
        workSpaceStore.updateRecycleBinCount()
        
        return true
      } else {
        ElMessage.error('永久删除问卷失败: ' + res.errmsg)
        return false
      }
    } catch (err) {
      ElMessage.error('永久删除问卷失败: ' + err)
      return false
    }
  }
  
  // 将问卷移至回收站
  async function moveSurveyToRecycleBin(id: string) {
    try {
      console.log('移动问卷至回收站，问卷ID:', id)
      const res: any = await moveToRecycleBin(id)
      console.log('移动问卷至回收站响应:', res)
      
      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('问卷已移至回收站')
        
        // 更新回收站菜单数量
        const workSpaceStore = useWorkSpaceStore()
        workSpaceStore.updateRecycleBinCount()
        
        return true
      } else {
        const errorMsg = `移动问卷至回收站失败: ${res.errmsg || '服务器错误'}`
        console.error(errorMsg)
        ElMessage.error(errorMsg)
        return false
      }
    } catch (err: any) {
      console.error('移动问卷至回收站异常:', err)
      let errorMessage = '移动问卷至回收站失败'
      
      if (err.message) {
        errorMessage += `: ${err.message}`
      }
      
      if (err.response) {
        console.error('HTTP响应详情:', err.response)
        errorMessage += ` (状态码: ${err.response.status})`
      }
      
      ElMessage.error(errorMessage)
      return false
    }
  }
  
  return {
    recycleBinList,
    recycleBinTotal,
    getRecycleList,
    restoreSurveyById,
    deleteSurveyPermanently,
    moveSurveyToRecycleBin
  }
}) 