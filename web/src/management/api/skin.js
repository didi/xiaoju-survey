import axios from './base'

export const getBannerData = () => {
  return axios.get('/survey/getBannerData')
}
