/**
 * 处理单题的配置
 */

import { get as _get, map as _map } from 'lodash-es';

// 处理选择题的options
function handleOptions(item) {
  const { type } = item;
  const options = item.options || [];

  const arr = _map(options, (optionItem) => {
    const cleanOption = {};

    // 投票逻辑处理
    if (type.indexOf('vote') > -1) {
      cleanOption.voteCount = 0;
    }

    return { value: optionItem['hash'], ...optionItem, ...cleanOption };
  });

  return { options: arr };
}

export default function (questionConfig) {
  let dataList = _get(questionConfig, 'dataConf.dataList');
  // 将题目列表转成对象，并且对题目类型、题目的选项做一些字段的增加和转换
  const questionData = dataList.reduce((pre, item) => {
    Object.assign(pre, {
      [item.field]: {
        indexNumber: '',
        voteTotal: 0,
        ...item,
        ...handleOptions(item),
      },
    });
    return pre;
  }, {});

  return {
    questionData,
  };
}
