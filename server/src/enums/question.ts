/**
 * @description 问卷题目类型
 */
export enum QUESTION_TYPE {
  /**
   * 单行输入框
   */
  TEXT = 'text',
  /**
   * 多行输入框
   */
  TEXTAREA = 'textarea',
  /**
   * 单项选择
   */
  RADIO = 'radio',
  /**
   * 多项选择
   */
  CHECKBOX = 'checkbox',
  /**
   * 判断题
   */
  BINARY_CHOICE = 'binary-choice',
  /**
   * 评分
   */
  RADIO_STAR = 'radio-star',
  /**
   * nps评分
   */
  RADIO_NPS = 'radio-nps',
  /**
   * 投票
   */
  VOTE = 'vote',
}
