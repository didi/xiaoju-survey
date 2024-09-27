import { get } from 'lodash';
import moment from 'moment';
import templateBase from '../template/surveyTemplate/templateBase.json';
import normalCode from '../template/surveyTemplate/survey/normal.json';
import npsCode from '../template/surveyTemplate/survey/nps.json';
import registerCode from '../template/surveyTemplate/survey/register.json';
import voteCode from '../template/surveyTemplate/survey/vote.json';
import { QUESTION_TYPE } from 'src/enums/question';

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
  code.baseConf.beginTime = nowMoment.format('YYYY-MM-DD HH:mm:ss');
  code.baseConf.endTime = nowMoment
    .add(10, 'years')
    .format('YYYY-MM-DD HH:mm:ss');
  return code;
}

export function getListHeadByDataList(dataList) {
  const listHead = dataList.map((question) => {
    let othersCode;
    const radioType = [QUESTION_TYPE.RADIO_STAR, QUESTION_TYPE.RADIO_NPS];
    if (radioType.includes(question.type)) {
      const rangeConfigKeys = question.rangeConfig
        ? Object.keys(question.rangeConfig)
        : [];
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
    field: 'diffTime',
    title: '答题耗时（秒）',
    type: QUESTION_TYPE.TEXT,
  });
  listHead.push({
    field: 'createdAt',
    title: '提交时间',
    type: QUESTION_TYPE.TEXT,
  });
  return listHead;
}

export function transformAndMergeArrayFields(data) {
  const transformedData = {};

  for (const key in data) {
    const valueMap: Record<string, number> = {};

    for (const entry of data[key]) {
      const nestedDataKey = Object.keys(entry.data)[0];
      const nestedDataValue = entry.data[nestedDataKey];

      if (Array.isArray(nestedDataValue)) {
        for (const value of nestedDataValue) {
          if (!valueMap[value]) {
            valueMap[value] = 0;
          }
          valueMap[value] += entry.count;
        }
      } else {
        if (!valueMap[nestedDataValue]) {
          valueMap[nestedDataValue] = 0;
        }
        valueMap[nestedDataValue] += entry.count;
      }
    }

    transformedData[key] = Object.keys(valueMap).map((value) => ({
      count: valueMap[value],
      data: {
        [key]: value,
      },
    }));
  }

  return transformedData;
}

export function handleAggretionData({ dataMap, item }) {
  const type = dataMap[item.field].type;
  const aggregationMap = item.data.aggregation.reduce((pre, cur) => {
    pre[cur.id] = cur;
    return pre;
  }, {});
  if (
    [
      QUESTION_TYPE.RADIO,
      QUESTION_TYPE.CHECKBOX,
      QUESTION_TYPE.VOTE,
      QUESTION_TYPE.BINARY_CHOICE,
    ].includes(type)
  ) {
    return {
      ...item,
      title: dataMap[item.field].title,
      type: dataMap[item.field].type,
      data: {
        ...item.data,
        aggregation: dataMap[item.field].options.map((optionItem) => {
          return {
            id: optionItem.hash,
            text: optionItem.text,
            count: aggregationMap[optionItem.hash]?.count || 0,
          };
        }),
      },
    };
  } else if (
    [QUESTION_TYPE.RADIO_STAR, QUESTION_TYPE.RADIO_NPS].includes(type)
  ) {
    const summary: Record<string, any> = {};
    const average = getAverage({ aggregation: item.data.aggregation });
    const median = getMedian({ aggregation: item.data.aggregation });
    const variance = getVariance({
      aggregation: item.data.aggregation,
      average,
    });
    summary['average'] = average;
    summary['median'] = median;
    summary['variance'] = variance;
    if (type === QUESTION_TYPE.RADIO_NPS) {
      summary['nps'] = getNps({ aggregation: item.data.aggregation });
    }
    const range = type === QUESTION_TYPE.RADIO_NPS ? [0, 10] : [1, 5];
    const arr = [];
    for (let i = range[0]; i <= range[1]; i++) {
      arr.push(i);
    }
    return {
      ...item,
      title: dataMap[item.field].title,
      type: dataMap[item.field].type,
      data: {
        aggregation: arr.map((item) => {
          const num = item.toString();
          return {
            text: num,
            id: num,
            count: aggregationMap?.[num]?.count || 0,
          };
        }),
        submitionCount: item.data.submitionCount,
        summary,
      },
    };
  } else {
    return {
      ...item,
      title: dataMap[item.field].title,
      type: dataMap[item.field].type,
    };
  }
}

function getAverage({ aggregation }) {
  const { sum, count } = aggregation.reduce(
    (pre, cur) => {
      const num = parseInt(cur.id);
      pre.sum += num * cur.count;
      pre.count += cur.count;
      return pre;
    },
    { sum: 0, count: 0 },
  );
  if (count === 0) {
    return 0;
  }
  return (sum / count).toFixed(2);
}

function getMedian({ aggregation }) {
  const sortedArr = aggregation.sort((a, b) => {
    return parseInt(a.id) - parseInt(b.id);
  });
  const resArr = [];
  for (const item of sortedArr) {
    const tmp = new Array(item.count).fill(parseInt(item.id));
    resArr.push(...tmp);
  }
  if (resArr.length === 0) {
    return 0;
  }
  if (resArr.length % 2 === 1) {
    const midIndex = Math.floor(resArr.length / 2);
    return resArr[midIndex].toFixed(2);
  }
  const rightIndex = resArr.length / 2;
  const leftIndex = rightIndex - 1;
  return ((resArr[leftIndex] + resArr[rightIndex]) / 2).toFixed(2);
}

function getVariance({ aggregation, average }) {
  const { sum, count } = aggregation.reduce(
    (pre, cur) => {
      const sub = Number(cur.id) - average;
      pre.sum += sub * sub;
      pre.count += cur.count;
      return pre;
    },
    { sum: 0, count: 0 },
  );
  if (count === 0 || count === 1) {
    return '0.00';
  }
  return (sum / (count - 1)).toFixed(2);
}

function getNps({ aggregation }) {
  // 净推荐值(NPS)=(推荐者数/总样本数)×100%-(贬损者数/总样本数)×100%
  // 0～10分举例子：推荐者（9-10分）；被动者（7-8分）；贬损者（0-6分）
  let recommand = 0,
    derogatory = 0,
    total = 0;
  for (const item of aggregation) {
    const num = parseInt(item.id);
    if (num >= 9) {
      recommand += item.count;
    } else if (num <= 6) {
      derogatory += item.count;
    }
    total += item.count;
  }
  return ((recommand / total - derogatory / total) * 100).toFixed(2) + '%';
}
