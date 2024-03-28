export enum VALUE_TYPE {
  TEXT = 'text',
  OPTION = 'option',
}

/**
 * 对问卷的题目列表和提交的数据进行组合
 * @param param0.surveyResponse 回收的数据
 * @param param0.responseSchema 问卷的配置
 * @returns 组装好的数据
 */
export const getPushingData = ({
  surveyResponse,
  questionList,
  surveyId,
  surveyPath,
}) => {
  const surveyResponseId = surveyResponse._id.toString();
  const data = questionList
    .filter((question) => {
      const value = surveyResponse.data[question.field];
      return value !== undefined;
    })
    .map((question) => {
      // 遍历题目列表
      let value = surveyResponse.data[question.field];
      // 统一数组格式，不区分题型还有单选多选
      value = Array.isArray(value) ? value : [value];
      let valueType = VALUE_TYPE.TEXT;
      const optionTextAndId = surveyResponse?.optionTextAndId?.[question.field];
      if (Array.isArray(optionTextAndId) && optionTextAndId.length > 0) {
        // 选项类的
        value = value.map((val) => {
          const index = optionTextAndId.findIndex((item) => item.hash === val);
          if (index > -1) {
            valueType = VALUE_TYPE.OPTION;
            // 拿到选项id、选项文本和别名
            const ret: Record<string, any> = {
              alias: '',
              id: optionTextAndId[index].hash,
              text: optionTextAndId[index].text,
            };
            const extraKey = `${question.field}_${ret.id}`;
            if (surveyResponse.data[extraKey]) {
              // 更多输入框
              ret.extraText = surveyResponse.data[extraKey];
            }
            return ret;
          }
          return val;
        });
      }
      if (typeof value[0] === 'number') {
        // 评分、nps类的
        value = value.map((val) => {
          valueType = VALUE_TYPE.OPTION;
          const extraKey = `${question.field}_${val}`;
          // 组装成选项类的格式
          const ret: Record<string, any> = {
            alias: '',
            id: val,
            text: val.toString(),
          };
          if (surveyResponse.data[extraKey]) {
            // 更多输入框
            ret.extraText = surveyResponse.data[extraKey];
          }
          return ret;
        });
      }
      // 返回题目id、题目标题、数据类型、别名（目前未开放）、还有用户的答案
      return {
        questionId: question.field,
        title: question.title,
        valueType,
        alias: '',
        value,
      };
    });
  // 返回问卷id、问卷path、回收id和组装好的问卷和答案数据
  return {
    surveyId: surveyId,
    surveyPath: surveyPath,
    surveyResponseId,
    data,
  };
};
