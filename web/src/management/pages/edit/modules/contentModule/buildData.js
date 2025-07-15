import { pick as _pick, get as _get } from 'lodash-es'
import { joinPath } from '@/common/utils/path'

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
  if (!configData.bannerConf.bannerConfig.bgImage.startsWith(import.meta.env.VITE_BASE)) {
    configData.bannerConf.bannerConfig.bgImage = joinPath(
      import.meta.env.VITE_BASE,
      configData.bannerConf.bannerConfig.bgImage
    )
  }
  if (!configData.bottomConf.logoImage.startsWith(import.meta.env.VITE_BASE)) {
    configData.bottomConf.logoImage = joinPath(
      import.meta.env.VITE_BASE,
      configData.bottomConf.logoImage
    )
  }

  return {
    surveyId,
    configData,
    sessionId
  }
}
