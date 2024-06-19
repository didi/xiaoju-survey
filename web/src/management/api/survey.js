import axios from './base'

export const getSurveyList = ({ curPage, filter, order, workspaceId }) => {
  return axios.get('/survey/getList', {
    params: {
      pageSize: 10,
      curPage,
      filter,
      order,
      workspaceId
    }
  })
}

export const getSurveyById = (id) => {
  return axios.get('/survey/getSurvey', {
    params: {
      surveyId: id
    }
  })
}

export const saveSurvey = ({ surveyId, configData }) => {
  return axios.post('/survey/updateConf', { surveyId, configData })
}

export const publishSurvey = ({ surveyId }) => {
  return axios.post('/survey/publishSurvey', {
    surveyId
  })
}

export const createSurvey = (data) => {
  return axios.post('/survey/createSurvey', data)
}

export const getSurveyHistory = ({ surveyId, historyType }) => {
  return axios.get('/surveyHisotry/getList', {
    params: {
      surveyId,
      historyType
    }
  })
}

export const deleteSurvey = (surveyId) => {
  return axios.post('/survey/deleteSurvey', {
    surveyId
  })
}

export const updateSurvey = (data) => {
  return axios.post('/survey/updateMeta', data)
}
