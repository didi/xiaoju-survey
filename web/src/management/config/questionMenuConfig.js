export const menuItems = {
  text: {
    type: 'text',
    snapshot: '/imgs/question-type-snapshot/iL84te6xxU1657702189333.webp',
    path: 'InputModule',
    icon: 'tixing-danhangshuru',
    title: '单行输入框'
  },
  textarea: {
    type: 'textarea',
    snapshot: '/imgs/question-type-snapshot/11iAo3ca0u1657702225416.webp',
    path: 'TextareaModule',
    icon: 'tixing-duohangshuru',
    title: '多行输入框'
  },
  radio: {
    type: 'radio',
    snapshot: '/imgs/question-type-snapshot/TgeRDfURJZ1657702220602.webp',
    icon: 'tixing-danxuan',
    path: 'RadioModule',
    title: '单项选择'
  },
  checkbox: {
    type: 'checkbox',
    path: 'CheckboxModule',
    snapshot: '/imgs/question-type-snapshot/Md2YmzBBpV1657702223744.webp',
    icon: 'tixing-duoxuan',
    title: '多项选择'
  },
  'binary-choice': {
    type: 'binary-choice',
    snapshot: '/imgs/question-type-snapshot/blW8U1ckzd1657702223023.webp',
    path: 'BinaryChoiceModule',
    icon: 'tixing-panduanti',
    title: '判断题'
  },
  'radio-star': {
    type: 'radio-star',
    snapshot: '/imgs/question-type-snapshot/7CU6tn4XqT1657702221208.webp',
    path: 'StarModule',
    icon: 'tixing-pingfen',
    title: '评分'
  },
  'radio-nps': {
    type: 'radio-nps',
    path: 'NpsModule',
    snapshot: '/imgs/question-type-snapshot/radio-nps.webp',
    icon: 'NPSpingfen',
    title: 'nps评分'
  },
  vote: {
    type: 'vote',
    path: 'VoteModule',
    snapshot: '/imgs/question-type-snapshot/nGTscsZlwn1657702222857.webp',
    icon: 'tixing-toupiao',
    title: '投票'
  }
}

const menuGroup = [
  {
    title: '输入类题型',
    questionList: ['text', 'textarea']
  },
  {
    title: '选择类题型',
    questionList: ['radio', 'checkbox', 'binary-choice', 'radio-star', 'radio-nps', 'vote']
  }
]

const menu = menuGroup.map((group) => {
  group.questionList = group.questionList.map((question) => menuItems[question])
  return group
})

export const questionTypeList = Object.values(menuItems)

export default menu
