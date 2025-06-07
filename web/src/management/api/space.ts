import axios from './base'
// 空间
export const createSpace = ({ name, description, members }: any) => {
  return axios.post('/workspace', { name, description, members })
}

export const updateSpace = ({ workspaceId, name, description, members }: any) => {
  return axios.post(`/workspace/${workspaceId}`, { name, description, members })
}

export const getSpaceList = (params: any) => {
  return axios.get('/workspace', {
    params
  })
}

export const getSpaceDetail = (workspaceId: string) => {
  return axios.get(`/workspace/${workspaceId}`)
}

export const getMemberList = () => {
  return axios.get('/workspace/member/list')
}

export const deleteSpace = (workspaceId: string) => {
  return axios.delete(`/workspace/${workspaceId}`)
}

export const getUserList = (username: string) => {
  return axios.get(`/user/getUserList`, {
    params: {
      username
    }
  })
}

// 获取协作权限下拉框枚举
export const getPermissionList = () => {
  return axios.get('collaborator/getPermissionList')
}

export const saveCollaborator = ({ surveyId, collaborators }: any) => {
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
// 获取问卷协作权限
export const getCollaboratorPermissions = (surveyId: string) => {
  return axios.get(`collaborator/permissions`, {
    params: {
      surveyId
    }
  })
}

export const createGroup = ({ name }: any) => {
  return axios.post('surveyGroup', { name })
}

export const updateGroup = ({ _id, name }: any) => {
  return axios.post(`/surveyGroup/update`, { name, groupId: _id })
}

export const getGroupList = (params: any) => {
  return axios.get('/surveyGroup', {
    params
  })
}

export const deleteGroup = (id: string) => {
  return axios.post(`/surveyGroup/delete`, { groupId: id })
}

export const getRecycleBinCount = (params: any) => {
  return axios.get('/recycleBin', {
    params
  })
}