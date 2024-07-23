import { defaultQuestionConfig } from '../config/questionConfig'
import { map as _map, cloneDeep } from 'lodash-es'
import questionLoader from '@/materials/questions/questionLoader'

const generateQuestionField = () => {
  const num = Math.floor(Math.random() * 1000)
  return `data${num}`
}

export function getRandom(len) {
  return Math.random()
    .toString()
    .slice(len && typeof len === 'number' ? 0 - len : -6)
}

const generateHash = (hashList) => {
  let hash = getRandom()
  let isExistsHash = hashList.includes(hash)

  while (isExistsHash) {
    hash = getRandom()
    isExistsHash = hashList.includes(hash)
  }
  return hash
}

export const getNewField = (fields) => {
  let field = generateQuestionField()
  let isFieldExists = fields.includes(field)

  while (isFieldExists) {
    field = generateQuestionField()
    isFieldExists = fields.includes(field)
  }
  return field
}

export const getQuestionByType = (type, fields) => {
  const questionMeta = questionLoader.getMeta(type)
  const { attrs } = questionMeta
  let newQuestion = defaultQuestionConfig
  if (attrs) {
    let questionSchema = {}
    attrs.forEach((element) => {
      questionSchema[element.name] = element.defaultValue
    })
    newQuestion = questionSchema
  } else {
    newQuestion = defaultQuestionConfig
    newQuestion.type = type
  }

  newQuestion.field = getNewField(fields) // 动态生成题目id
  if ('options' in newQuestion) {
    // 动态更新选项的hash-id
    const hashList = []
    for (const option of newQuestion.options) {
      const hash = generateHash(hashList)
      hashList.push(hash)
      option.hash = hash
    }
  }

  return cloneDeep(newQuestion)
}

export function filterQuestionPreviewData(data, currentEditOne = '') {
  let indexNumber = 1

  return _map(data, (item, index) => {
    const preType = item.type

    const newData = {
      ...item,
      isSelected: index === currentEditOne,
      indexNumber: 0,
      qIndex: index
    }
    // 根据是否展示序号，处理 indexNumber
    if (newData.showIndex) {
      newData.indexNumber = indexNumber
      indexNumber++
    }

    // 处理选项的方向
    newData.layout = /-v/.test(preType) ? 'vertical' : newData.layout

    return newData
  })
}
