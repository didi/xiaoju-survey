import { defaultQuestionConfig } from '../config/questionConfig';
import { cloneDeep as _cloneDeep, map as _map } from 'lodash-es';

const generateQuestionField = () => {
  const num = Math.floor(Math.random() * 1000);
  return `data${num}`;
};

function getRandom(len) {
  return Math.random()
    .toString()
    .slice(len && typeof len === 'number' ? 0 - len : -6);
}

const generateHash = (hashList) => {
  let hash = getRandom();
  let isExistsHash = hashList.includes(hash);

  while (isExistsHash) {
    hash = getRandom();
    isExistsHash = hashList.includes(hash);
  }
  return hash;
};

function getOptions(type) {
  const options = [].concat({ ..._cloneDeep(defaultQuestionConfig) }.options);
  if (type === 'binary-choice') {
    options[0].text = '对';
    options[1].text = '错';
  }
  return options;
}

export const getNewField = (fields) => {
  let field = generateQuestionField();
  let isFieldExists = fields.includes(field);

  while (isFieldExists) {
    field = generateQuestionField();
    isFieldExists = fields.includes(field);
  }
  return field;
};

export const getQuestionByType = (type, fields) => {
  const newQuestion = _cloneDeep(defaultQuestionConfig);
  newQuestion.type = type;
  newQuestion.field = getNewField(fields);
  newQuestion.options = getOptions(type);
  const hashList = [];
  for (const option of newQuestion.options) {
    const hash = generateHash(hashList);
    hashList.push(hash);
    option.hash = hash;
  }
  return newQuestion;
};

export function filterQuestionPreviewData(data, currentEditOne = '') {
  let indexNumber = 1;

  return _map(data, (item, index) => {
    const preType = item.type;

    const newData = {
      ...item,
      isSelected: index === currentEditOne,
      indexNumber: 0,
      qIndex: index,
    };
    // 根据是否展示序号，处理 indexNumber
    if (newData.showIndex) {
      newData.indexNumber = indexNumber;
      indexNumber++;
    }

    // 处理选项的方向
    newData.layout = /-v/.test(preType) ? 'vertical' : newData.layout;

    return newData;
  });
}
