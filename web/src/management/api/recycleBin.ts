import axios from './base'

// 获取回收站问卷列表
export function getRecycleBinList(params = {}) {
  return axios.post('/survey/recyclebin/list', params)
}

// 恢复问卷
export function restoreSurvey(id: string) {
  return axios.post('/survey/recyclebin/restore', { id })
}

// 永久删除问卷
export function permanentDeleteSurvey(id: string) {
  return axios.post('/survey/recyclebin/delete', { id })
}

// 将问卷移至回收站
export function moveToRecycleBin(id: string) {
  return axios.post('/survey/recyclebin/move', { id })
} 