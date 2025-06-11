// server/src/utils/index.ts

import { map, forEach, trim } from 'lodash';
import {questionLoader} from './questionLoader';
import { escapeFilterXSS } from './xss';

// 随机生成一个字段名 dataXXX
export function generateQuestionField(): string {
  const num = Math.floor(Math.random() * 1000);
  return `data${num}`;
}

// 随机字符串
export function getRandom(len?: number): string {
  return Math.random().toString().slice(
    len !== undefined && typeof len === 'number' ? -len : -6
  );
}

// 给已有的 hashList 生成一个新的不重复 hash
export function generateHash(hashList: string[]): string {
  let hash = getRandom();
  while (hashList.includes(hash)) {
    hash = getRandom();
  }
  return hash;
}

export function getNewField(fields: string[] = []): string {
  let field = generateQuestionField();
  while (fields.includes(field)) {
    field = generateQuestionField();
  }
  return field;
}

export function getQuestionByType(type: string, fields: string[] = []): Record<string, any> {
  const questionMeta = questionLoader.getMeta(type);
  const { attrs } = questionMeta;
  if (!attrs) {
    throw new Error('该题目配置不存在');
  }
  const questionSchema: Record<string, any> = {};
  attrs.forEach(({ name, defaultValue }: any) => {
    questionSchema[name] = defaultValue;
  });
  questionSchema.field = getNewField(fields);

  if (Array.isArray(questionSchema.options)) {
    const hashList: string[] = [];
    questionSchema.options.forEach((option: any) => {
      const hash = generateHash(hashList);
      hashList.push(hash);
      option.hash = hash;
    });
  }

  return questionSchema;
}

export function filterQuestionPreviewData(
  data: Record<string, any>[],
  currentEditOne: number | string = ''
): Record<string, any>[] {
  let indexNumber = 1;
  return map(data, (item, index) => {
    const newData = {
      ...item,
      isSelected: index === currentEditOne,
      indexNumber: 0,
      qIndex: index,
      layout: /-v/.test(item.type) ? 'vertical' : item.layout,
    } as any;
    if (newData.showIndex) {
      newData.indexNumber = indexNumber++;
    }
    return newData;
  });
}

export function getNewHash(hashMap: Record<string, boolean> = {}): string {
  let random = getRandom();
  while (hashMap[random]) {
    random = getRandom();
  }
  return random;
}

export function getMultiOptionByText(text: string): Record<string, any>[] {
  const optionListItem = [
    'text', 'others', 'mustOthers', 'limit',
    'score', 'othersKey', 'placeholderDesc', 'hash'
  ];

  const lines = text.split('\n').filter(line => trim(line));
  const moduleData: Record<string, any>[] = [];

  lines.forEach(line => {
    const cols = line.split('\t');
    let idx = 0;
    const hashMap: Record<string, boolean> = {};
    const rObj: Record<string, any> = {};

    optionListItem.forEach(key => {
      const cell = trim(cols[idx] || '');
      switch (key) {
        case 'mustOthers':
        case 'others':
          rObj[key] = !(cell === 'false' || cell === '');
          idx++;
          break;
        case 'score':
          rObj[key] = parseInt(cell) || 0;
          idx++;
          break;
        case 'hash':
          rObj[key] = parseInt(cell) ? parseInt(cell) : getNewHash(hashMap);
          idx++;
          hashMap[rObj[key]] = true;
          break;
        default:
          rObj[key] = escapeFilterXSS(cell);
          idx++;
      }
    });

    moduleData.push(rObj);
  });

  return moduleData;
}
