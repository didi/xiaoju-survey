import axios from './base';

export const getSurveyList = (curPage) => {
  return axios.get('/surveyManage/list', {
    params: {
      pageSize: 10,
      curPage,
    },
  });
};

export const getSurveyById = (id) => {
  return axios.get('/surveyManage/get', {
    params: {
      surveyId: id,
    },
  });
};

export const saveSurvey = ({ surveyId, configData }) => {
  return axios.post('/surveyManage/saveConf', { surveyId, configData });
};

export const publishSurvey = ({ surveyId }) => {
  return axios.post('/surveyManage/publish', {
    surveyId,
  });
};

export const createSurvey = (data) => {
  return axios.post('/surveyManage/add', data);
};

export const getSurveyHistory = ({ surveyId, historyType }) => {
  return axios.get('/surveyManage/getHistoryList', {
    params: {
      surveyId,
      historyType,
    },
  });
};

export const deleteSurvey = (surveyId) => {
  return axios.post('/surveyManage/delete', {
    surveyId,
  });
};

export const updateSurvey = (data) => {
  return axios.post('/surveyManage/update', data);
};

export const copySurvey = (data) => {
  return axios.post('/surveyManage/create', data);
};
