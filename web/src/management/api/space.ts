import axios from './base'

// 空间
export const createSpace = ({name, description, members} : any) => {
  return axios.post('/workspace', { name, description, members  })
}

export const updateSpace = ({workspaceId, name, description, members} : any) => {
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

export const getUserDetail = (username: string) => {
  return axios.get(`/user/getUserList`, {
    params: {
      username
    }
  })
}

//空间成员管理
// 查
export const getSpaceMembers = (workspaceId: string) => {
  return axios.get(`/workspaceMember`, {
    params: {
      workspaceId
    }
  })
}
// 增
export const addSpaceMembers = (userId: string, role: string, workspaceId: string) => {
  return axios.post(`/workspaceMember`, { userId, role, workspaceId })
}
// 改
export const updateSpaceMembers = (userId: string, role: string, workspaceId: string) => {
  return axios.post(`/workspaceMember/updateRole`, { userId, role, workspaceId })
}
// 删
export const deleteSpaceMembers = (userId: string, workspaceId: string) => {
  return axios.delete(`/workspaceMember/deleteMember`, { userId, workspaceId } as any)
}

// 获取所有成员
export const getMembers = () => {
  return axios.get(`/workspaceMember/`)
}
