import { get } from 'lodash';
import moment from 'moment';
import templateBase from '../template/surveyTemplate/templateBase.json';
import normalCode from '../template/surveyTemplate/survey/normal.json';
import npsCode from '../template/surveyTemplate/survey/nps.json';
import registerCode from '../template/surveyTemplate/survey/register.json';
import voteCode from '../template/surveyTemplate/survey/vote.json';

const schemaDataMap = {
  normal: normalCode,
  nps: npsCode,
  register: registerCode,
  vote: voteCode,
};

export async function getSchemaBySurveyType(surveyType: string) {
  // Implement your logic here
  const codeData = get(schemaDataMap, surveyType);
  if (!codeData) {
    throw new Error('问卷类型不存在');
  }
  const code = Object.assign({}, templateBase, codeData);
  const nowMoment = moment();
  code.baseConf.begTime = nowMoment.format('YYYY-MM-DD HH:mm:ss');
  code.baseConf.endTime = nowMoment
    .add(10, 'years')
    .format('YYYY-MM-DD HH:mm:ss');
  return code;
}

export function getListHeadByDataList(dataList) {
  const listHead = dataList.map((question) => {
    let othersCode;
    if (question.type === 'radio-star') {
      const rangeConfigKeys = Object.keys(question.rangeConfig);
      if (rangeConfigKeys.length > 0) {
        othersCode = [{ code: `${question.field}_custom`, option: '填写理由' }];
      }
    } else {
      othersCode = (question.options || [])
        .filter((optionItem) => optionItem.othersKey)
        .map((optionItem) => {
          return {
            code: optionItem.othersKey,
            option: optionItem.text,
          };
        });
    }
    return {
      field: question.field,
      title: question.title,
      type: question.type,
      othersCode,
    };
  });
  listHead.push({
    field: 'difTime',
    title: '答题耗时（秒）',
    type: 'text',
  });
  listHead.push({
    field: 'createDate',
    title: '提交时间',
    type: 'text',
  });
  return listHead;
}
