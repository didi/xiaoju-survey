import { isMobile } from '../utils/index'

export default {
  surveyPath: '',
  questionData: null,
  isMobile: isMobile(),
  errorInfo: {
    errorType: '',
    errorMsg: ''
  },
  enterTime: null,
  questionSeq: [], // 题目的顺序，因为可能会有分页的情况，所以是一个二维数组[[qid1, qid2], [qid3,qid4]]
  voteMap: {},
  encryptInfo: null,
  ruleEngine: null,
  whiteData: {
    
  }
}
