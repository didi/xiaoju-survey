import axios from './base'
// 渠道
export const createChannel = ({ name, type, surveyId }: any) => {
  return axios.post('/channel/create', { name, type, surveyId })
}

export const updateChannel = ({ channelId, surveyId, name }: any) => {
  return axios.post(`/channel/update`, { channelId, surveyId, name })
}

export const getChannelList = (params: any) => {
  return axios.get('/channel/getList', {
    params
  })
}

export const deleteChannel = ({ channelId }: any) => {
  return axios.post(`/channel/delete`, { channelId })
}

export const changeChannelStatus = (channelId: string, status: string) => {
  return axios.post(`/channel/status`, { channelId, status})
}