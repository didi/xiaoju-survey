import axios from './base';

export const getRecycleList = (data) => {
  return axios.get('/surveyManage/data', {
    params: {
      pageSize: 10,
      ...data,
    },
  });
};
