import axios from './base'

export const getUserInfo = () => {
  return axios.post('/user/getUserInfoV2')
}
