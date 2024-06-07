// 问卷操作枚举
export const QOP_MAP = {
  ADD: 'add',
  COPY: 'copy',
  EDIT: 'edit'
}

export enum QUESTION_TYPE {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  BINARY_CHOICE = 'binary-choice',
  RADIO_STAR = 'radio-star',
  RADIO_NPS = 'radio-nps',
  VOTE = 'vote',
}

// 输入类题型
export const INPUT = [
  QUESTION_TYPE.TEXT,
  QUESTION_TYPE.TEXTAREA
]

// 普通选择类题型分类
export const NORMAL_CHOICES =  [
  QUESTION_TYPE.RADIO,
  QUESTION_TYPE.CHECKBOX
]

// 选择类题型分类
export const CHOICES =  [
  QUESTION_TYPE.RADIO,
  QUESTION_TYPE.CHECKBOX,
  QUESTION_TYPE.BINARY_CHOICE,
  QUESTION_TYPE.VOTE
]

// 评分题题型分类
export const RATES = [
  QUESTION_TYPE.RADIO_STAR,
  QUESTION_TYPE.RADIO_NPS
]

export const operatorOptions = [
  {
    label: '选择了',
    value: 'in'
  },
  {
    label: '不选择',
    value: 'nin'
  }
]
