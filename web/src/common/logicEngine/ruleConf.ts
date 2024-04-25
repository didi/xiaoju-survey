export const ruleConf = [
  {
    "conditions": [
        {
          "field": "data515",
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
    "target": "data629"
  },
  // {
  //   "conditions": [
  //       {
  //         "field": "q1",
  //         "operator": "in",
  //         "value": ['选项2']
  //       },
  //   ],
  //   "scope": "option",
  //   "target": "q3-o1"
  // }
]