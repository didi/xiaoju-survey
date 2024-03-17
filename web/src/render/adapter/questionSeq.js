import { get as _get, last as _last } from 'lodash-es';

export default function handleQuestionSeq(questionConfig) {
  const dataList = _get(questionConfig, 'dataConf.dataList', []);
  return {
    // 对题目做一些排序和分组，返回题目id的列表
    questionSeq: dataList.reduce(
      (pre, item) => {
        const { field } = item;

        // 每次都在最后一个数组里push题目
        _last(pre).push(field);

        return pre;
      },
      [[]]
    ),
  };
}
