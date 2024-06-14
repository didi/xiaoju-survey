import axios from './base'

export const getRecycleList = (data) => {
  return axios.get('/survey/dataStatistic/dataTable', {
    params: {
      pageSize: 10,
      ...data
    }
  })
}
//问卷下载
export const downloadSurvey = ({surveyId,isDesensitive}) => {
  return axios.get('/survey/surveyDownload/download', {
    params: {
      surveyId,
      isDesensitive
    }
  })
}
