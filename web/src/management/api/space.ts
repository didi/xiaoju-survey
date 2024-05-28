import axios from './base'

// 空间
export const createSpace = ({ name, description, members }: any) => {
  return axios.post('/workspace', { name, description, members })
}

export const updateSpace = ({ workspaceId, name, description, members }: any) => {
  return axios.post(`/workspace/${workspaceId}`, { name, description, members })
}

export const spaceList = () => {
  return axios.get('/workspace')
}

export const spaceDetail = (workspaceId: string) => {
  return axios.get(`/workspace/${workspaceId}`)
}

export const spaceDelete = (workspaceId: string) => {
  return axios.delete(`/workspace/${workspaceId}`)
}

export const getUserList = (username: string) => {
  return axios.get(`/user/getUserList`, {
    params: {
      username
    }
  })
}

// 协作权限列表
export const getPermissionList = () => {
  return axios.get('collaborator/getPermissionList')
}

export const collaboratorBatchSave = ({ surveyId, collaborators }: any) => {
  return axios.post('collaborator/batchSave', {
    surveyId,
    collaborators
  })
}

// 添加协作人
export const addCollaborator = ({ surveyId, userId, permissions }: any) => {
  return axios.post('collaborator', {
    surveyId,
    userId,
    permissions
  })
}
// 更新问卷协作信息
export const updateCollaborator = ({ surveyId, userId, permissions }: any) => {
  return axios.post('collaborator/changeUserPermission', {
    surveyId,
    userId,
    permissions
  })
}
// 获取问卷协作信息
export const getCollaborator = (surveyId: string) => {
  return axios.get(`collaborator`, {
    params: {
      surveyId
    }
  })
}
