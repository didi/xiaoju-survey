import axios from './base';

export const getBannerData = () => {
  return axios.get('/surveyManage/getBannerData');
};
