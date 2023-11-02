import _pick from 'lodash/pick';
import _get from 'lodash/get';

// 生成需要保存到接口的数据
export default function (schema) {
  const surveyId = _get(schema, 'metaData._id');
  const configData = _pick(schema, [
    'bannerConf',
    'baseConf',
    'bottomConf',
    'skinConf',
    'submitConf',
    'questionDataList',
  ]);
  configData.dataConf = {
    dataList: configData.questionDataList,
  };
  delete configData.questionDataList;
  return {
    surveyId,
    configData,
  };
}
