export enum QUESTION_TYPE {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  BINARYCHOICE = 'binary-choice',
  RADIOSTAR = 'radio-star',
  RADIONPS = 'radio-nps',
  VOTE = 'vote',
}

// 输入类题型
export const INPUT = [
  QUESTION_TYPE.TEXT,
  QUESTION_TYPE.TEXTAREA
]

// 选择类题型分类
export const CHOICES =  [
  QUESTION_TYPE.RADIO,
  QUESTION_TYPE.CHECKBOX
]
// 评分题题型分类
export const RATES = [
  QUESTION_TYPE.RADIOSTAR,
  QUESTION_TYPE.RADIONPS
]
