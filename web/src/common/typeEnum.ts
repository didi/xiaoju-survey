// 题型枚举
export enum QUESTION_TYPE {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  BINARY_CHOICE = 'binary-choice',
  RADIO_STAR = 'radio-star',
  RADIO_NPS = 'radio-nps',
  VOTE = 'vote'
}

// 题目类型标签映射对象
export const typeTagLabels: Record<QUESTION_TYPE, string> = {
  [QUESTION_TYPE.TEXT]: '单行输入框',
  [QUESTION_TYPE.TEXTAREA]: '多行输入框',
  [QUESTION_TYPE.RADIO]: '单选',
  [QUESTION_TYPE.CHECKBOX]: '多选',
  [QUESTION_TYPE.BINARY_CHOICE]: '判断',
  [QUESTION_TYPE.RADIO_STAR]: '评分',
  [QUESTION_TYPE.RADIO_NPS]: 'NPS评分',
  [QUESTION_TYPE.VOTE]: '投票'
}

// 输入类题型
export const INPUT = [QUESTION_TYPE.TEXT, QUESTION_TYPE.TEXTAREA]

// 选择类题型分类
export const NORMAL_CHOICES = [QUESTION_TYPE.RADIO, QUESTION_TYPE.CHECKBOX]

// 选择类题型分类
export const CHOICES = [
  QUESTION_TYPE.RADIO,
  QUESTION_TYPE.CHECKBOX,
  QUESTION_TYPE.BINARY_CHOICE,
  QUESTION_TYPE.VOTE
]

// 评分题题型分类
export const RATES = [QUESTION_TYPE.RADIO_STAR, QUESTION_TYPE.RADIO_NPS]
