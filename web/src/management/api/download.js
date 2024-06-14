import axios from './base'

//问卷列表
export const getDownloadList = ({ownerId,page,pageSize}) => {
  return axios.get('/survey/surveyDownload/getdownloadList', {
    params: {
        ownerId,
        page,
        pageSize
    }
  })
}
//问卷下载
export const getDownloadFileByName = (fileName) => {
  return axios.get('/survey/surveyDownload/getdownloadfileByName', {
      params: {
        owner,
        fileName
      },
      responseType: 'blob', 
    }).then(res => {
      return res
    });
}
//问卷删除
export const deleteDownloadFile = (owner,fileName) => {
  return axios.get('/survey/surveyDownload/deletefileByName', {
    params: {
      owner,
      fileName
    },
  })
}