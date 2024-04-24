export const ruleConf = [
  {
    "conditions": [
        {
          "field": "q1",
          "operator": "in",
          "value": ['选项1', '选项2']
        },
        {
          "field": "q1",
          "operator": "nin",
          "value": ['选项4']
        }
    ],
    "scope": "question",
    "target": "q3"
  },
  {
    "conditions": [
        {
          "field": "q1",
          "operator": "in",
          "value": ['选项2']
        },
    ],
    "scope": "option",
    "target": "q3-o1"
  }
]
