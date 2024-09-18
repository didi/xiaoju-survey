import axios from './base'

export const createDownloadSurveyResponseTask = ({ surveyId, isDesensitive }) => {
  return axios.post('/downloadTask/createTask', {
    surveyId,
    isDesensitive
  })
}

export const getDownloadTask = (taskId) => {
  return axios.get('/downloadTask/getDownloadTask', { params: { taskId } })
}

export const getDownloadTaskList = ({ pageIndex, pageSize }) => {
  return axios.get('/downloadTask/getDownloadTaskList', {
    params: {
      pageIndex,
      pageSize
    }
  })
}

//问卷删除
export const deleteDownloadTask = (taskId) => {
  return axios.post('/downloadTask/deleteDownloadTask', {
    taskId
  })
}
