import { cleanRichText } from './index';
import { CONTROL_TYPES } from '../models/index';
import type {
  Option,
  ControlProps,
  SurveySchemaData,
  FormateConfigData,
} from '../models/index';
import { getServerConfig } from './http';
import { mapToObject } from '../utils';

function getOptions(options: Option) {
  if (Array.isArray(options) && options.length) {
    return options.map(({ text, hash }) => ({
      text: cleanRichText(text),
      originText: text,
      hash,
    }));
  }
  return [];
}

export const formatSubmitParams = (originParams: {
  formValues: Map<string, any>;
  activityId: string;
  startTime: number;
}): any => {
  const { formValues, activityId, startTime } = originParams;
  const { channelId = '' } = getServerConfig();
  // @todo: 这里需要按照c提交接口传参，处理接口加签以及数据加密
  const formData = mapToObject(formValues);
  const endTime = Date.now();
  const params: any = {
    surveyPath: activityId,
    channelId,
    data: JSON.stringify(formData),
    diffTime: endTime - startTime,
    clientTime: endTime,
  };
  return params;
};

class QuestionDataFormater {
  data: SurveySchemaData;

  version: number;

  constructor(data: SurveySchemaData) {
    this.data = data;
    this.version = data.version || 1;
  }

  formateData(): FormateConfigData {
    const { title, activityId = '', data } = this.data;
    const { dataConf, baseConf, submitConf } = data;
    const { dataList = [] } = dataConf;
    const { beginTime, endTime, loginLimit } = baseConf;
    const nowStamp = new Date().getTime();
    const expired =
      nowStamp > Date.parse(endTime) || nowStamp < Date.parse(beginTime);
    let needLogin = false;
    if (loginLimit) {
      needLogin =
        loginLimit.type === 'sso' && loginLimit.manner === 'didiaccount';
    }
    const questionList: Array<ControlProps> = [];
    if (Array.isArray(dataList) && dataList.length) {
      const dataSource = dataList.filter((v) => CONTROL_TYPES.includes(v.type));
      dataSource.forEach((v, k) => {
        questionList.push({
          expired,
          type: v.type,
          field: v.field,
          index: k + 1,
          // nps: v.nps,
          star: v.star,
          npsMin: v.min,
          npsMax: v.max,
          nps: { leftText: v.minMsg, rightText: v.maxMsg },
          starMin: v.starMin,
          starMax: v.starMax,
          hasPrev: k !== 0,
          hasNext: k !== dataSource.length - 1,
          lastQuestion: k === dataSource.length - 1,
          rangeConfig: v.rangeConfig,
          version: this.version,
          options: getOptions(v.options),
          placeholder: v.placeholder || '',
          title: cleanRichText(v.title),
        });
      });
    }
    return {
      title,
      expired,
      needLogin,
      questionList,
      id: activityId,
      submitTitle: submitConf?.submitTitle || '提交反馈',
    };
  }
}

export default QuestionDataFormater;
