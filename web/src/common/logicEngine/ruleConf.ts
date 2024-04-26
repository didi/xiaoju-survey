export const ruleConf = [
  {
    "conditions": [
        {
          "field": "data515",  // 题目2
          "operator": "in",
          "value": ['115019']
        },
        {
          "field": "data515",
          "operator": "nin",
          "value": ['选项4']
        }
    ],
    "scope": "question",
    "target": "data648"  // 题目3
  },
  {
    "conditions": [
        {
          "field": "data648", // 题目3
          "operator": "in",
          "value": ['106374']
        },
    ],
    "scope": "question",
    "target": "data517" // 题目4
  },
  {
    "conditions": [
        {
          "field": "data648", // 题目3
          "operator": "in",
          "value": ['106374']
        },
    ],
    "scope": "option",
    "target": "data517-106374" // 题目4
  }
]