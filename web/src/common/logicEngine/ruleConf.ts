// test：静态数据，实际业务里无用
export const ruleConf = [
  {
    conditions: [
      {
        field: 'data515', // 题目2
        operator: 'in',
        value: ['115019']
      }
    ],
    scope: 'question',
    target: 'data648' // 题目3
  },
  {
    conditions: [
      {
        field: 'data648', // 题目3
        operator: 'in',
        value: ['106374']
      }
    ],
    scope: 'question',
    target: 'data517' // 题目4
  },
  {
    conditions: [
      {
        field: 'data648', // 题目3
        operator: 'in',
        value: ['106374']
      }
    ],
    scope: 'option',
    target: 'data517-106374' // 题目4
  }
]
