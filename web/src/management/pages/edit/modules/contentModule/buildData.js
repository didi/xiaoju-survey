import { pick as _pick, get as _get } from 'lodash-es'

// 生成需要保存到接口的数据
export default function (schema, sessionId) {
  const surveyId = _get(schema, 'metaData._id')
  const configData = _pick(schema, [
    'bannerConf',
    'baseConf',
    'bottomConf',
    'skinConf',
    'submitConf',
    'questionDataList',
    'pageConf',
    'logicConf'
  ])
  configData.dataConf = {
    dataList: configData.questionDataList
  }
  delete configData.questionDataList
  return {
    surveyId,
    configData,
    sessionId
  }
}
