// server/src/utils/typeMeta.ts

import { QUESTION_TYPE, typeTagLabels, INPUT, CHOICES, RATES, ADVANCED } from './typeEnum';  
import moduleList from './moduleList';  

/** 每个题型的元信息接口 */
export interface TypeMeta {
  /** 题型枚举值，和 textToSchema 一致 */  
  type: QUESTION_TYPE;  
  /** 前端组件文件夹名：widgets/{folder}/index.jsx */  
  folder: string;  
  /** 人类可读标题，和 typeTagLabels 一致 */  
  title: string;  
  /** 是否需要 options 列表 */  
  hasOptions: boolean;  
  /** 是否支持“其它”选项 */  
  supportsOther: boolean;  
  /** 是否为嵌套／高级题型 */  
  nested: boolean;  
  /** 前端渲染时可用的默认配置 */  
  defaultConfig?: {
    placeholder?: string;
    rows?: number;
    maxScore?: number;
  };
}

/** 根据枚举和值自动生成 meta 列表 */
export const typeMetaList: TypeMeta[] = (Object.values(QUESTION_TYPE) as QUESTION_TYPE[]).map((type) => {
  // folder 名直接从 moduleList 取，确保前后端一一对应 :contentReference[oaicite:0]{index=0}
  const folder = moduleList[type as keyof typeof moduleList];

  // 标题直接从 typeTagLabels 取，和 textToSchema 保持一致 :contentReference[oaicite:1]{index=1}
  const title = typeTagLabels[type];

  const hasOptions = CHOICES.includes(type);          // 选择类题型都要 options :contentReference[oaicite:2]{index=2}
  const supportsOther = type === QUESTION_TYPE.CHECKBOX;  // 只有多选支持“其它”
  const nested = ADVANCED.includes(type);             // 高级题型（如多级联动）才算 nested :contentReference[oaicite:3]{index=3}

  // 默认配置
  const defaultConfig: TypeMeta['defaultConfig'] = {};

  // 输入类题型加 placeholder/rows :contentReference[oaicite:4]{index=4}
  if (INPUT.includes(type)) {
    defaultConfig.placeholder = type === QUESTION_TYPE.TEXT  
      ? '请输入答案'  
      : '请输入详细描述';
    if (type === QUESTION_TYPE.TEXTAREA) {
      defaultConfig.rows = 4;
    }
  }

  // 评分题型加 maxScore :contentReference[oaicite:5]{index=5}
  if (RATES.includes(type)) {
    defaultConfig.maxScore = type === QUESTION_TYPE.RADIO_STAR ? 5 : 10;
  }

  return {
    type,
    folder,
    title,
    hasOptions,
    supportsOther,
    nested,
    ...(Object.keys(defaultConfig).length ? { defaultConfig } : {}),
  };
});

export default typeMetaList;
