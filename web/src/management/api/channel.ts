import axios from './base'
// 渠道
export const createChannel = ({ name, type }: any) => {
  return axios.post('/channel', { name, type })
}

export const updateChannel = ({ channelId, name }: any) => {
  return axios.post(`/channel/${channelId}`, { name })
}

export const getChannelList = (params: any) => {
  return axios.get('/channel', {
    params
  })
}

export const deleteChannel = ({ channelId }: any) => {
  return axios.delete(`/channel/${channelId}`)
}

export const changeChannelStatus = (channelId: string, status: string) => {
  return axios.post(`/channel/status/${channelId}`, { status})
}