// 题型基础字段模板
export const defaultQuestionConfig = {
  // 题目id
  field: '',
  // 显示序号
  showIndex: true,
  // 显示类型
  showType: true,
  // 显示分割线
  showSpliter: true,
  // 题目类型
  type: '',
  placeholderDesc: '',
  sLimit: 0,
  mhLimit: 0,
  title: '',
  placeholder: '',
  valid: '',
  isRequired: true,
  randomSort: false,
  showLeftNum: true,
  innerRandom: false,
  checked: false,
  selectType: 'radio',
  sortWay: 'v',
  noNps: '',
  minNum: '',
  maxNum: '',
  starStyle: 'star',
  starMin: 1,
  starMax: 5,
  min: 0,
  max: 10,
  minMsg: '极不满意',
  maxMsg: '十分满意',
  // 分值对应的开关和输入框配置，因为不是固定从0开始，用对象比较合适
  rangeConfig: {},
  // 选项
  options: [
    {
      text: '选项1',
      others: false,
      othersKey: '',
      placeholderDesc: '',
      quota: '0'
    },
    {
      text: '选项2',
      others: false,
      othersKey: '',
      placeholderDesc: '',
      quota: '0'
    }
  ],
  star: 5,
  optionOrigin: '',
  originType: 'selected',
  matrixOptionsRely: '',
  numberRange: {
    min: {
      placeholder: '0',
      value: 0
    },
    max: {
      placeholder: '1000',
      value: 1000
    }
  },
  textRange: {
    min: {
      placeholder: '0',
      value: 0
    },
    max: {
      placeholder: '500',
      value: 500
    }
  },
  deleteRecover: false,
  noDisplay: false
}
