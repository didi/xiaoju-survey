import axios from './base'

export const getPublishedSurveyInfo = ({ surveyPath }) => {
  return axios.get('/responseSchema/getSchema', {
    params: {
      surveyPath
    }
  })
}

export const getPreviewSchema = ({ surveyPath }) => {
  return axios.get('/survey/getPreviewSchema', {
    params: {
      surveyPath
    }
  })
}

export const submitForm = (data) => {
  return axios.post('/surveyResponse/createResponse', data)
}

export const queryVote = ({ surveyPath, fieldList }) => {
  return axios.get('/counter/queryOptionCountInfo', {
    params: {
      surveyPath,
      fieldList
    }
  })
}

export const getEncryptInfo = () => {
  return axios.get('/clientEncrypt/getEncryptInfo')
}

export const validate = ({ surveyPath,password, whitelist }) => {
  return axios.post(`/responseSchema/${surveyPath}/validate`, {
    password,
    whitelist
  })
}