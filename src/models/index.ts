export interface IResponse<T> {
  data: T;
  code: number;
  message: string;
}

export interface SurveyChannelData {
  channelInfo: {
    ownerId: string;
    surveyId: string;
    operatorId: string;
    name: string;
    type: string;
    status: string;
    surveyPath: string;
  };
}

export interface SurveySchemaData {
  title: string;
  surveyId?: string;
  activityId?: string;
  data: ConfigResponseData;
  version?: number;
}

interface LoginLimitProps {
  type: string;
  manner: string;
}

// 问卷配置
export interface ConfigResponseData {
  dataConf: {
    dataList: any[];
  };
  baseConf: {
    beginTime: string;
    endTime: string;
    loginLimit: LoginLimitProps;
    [key: string]: any;
  };
  submitConf: {
    submitTitle: string;
  };
}

// 问卷回收Params
type valueType = string | string[] | number;
export interface SurveyRecoveryParams {
  activityId: string;
  appid: string;
  formValues: { [key: string]: valueType };
  formOptions: { [key: string]: Array<{ id: string; value: string }> };
  metadata: {
    deviceId: string;
    clientTime: number;
    difTime: number;
    p: string;
    channel: string;
    channelType: string;
  };
  user?: {
    userInfo: {
      ticket: string;
      appid: string;
    };
    identity: string;
    memberKey: string;
    secret: string;
  };
}

export type SurveyRecoveryData = Omit<SurveyRecoveryParams, 'appid'> & {
  responseId: string;
};

// 题型
export interface ControlProps {
  field: string;
  title: string;
  options: Array<Option>;
  type: string;
  index: number;
  nps: { leftText: string; rightText: string };
  npsMin: number;
  npsMax: number;
  starMin: number;
  starMax: number;
  star: number;
  hasPrev: boolean;
  hasNext: boolean;
  lastQuestion: boolean;
  placeholder: string;
  expired: boolean;
  version: number;
  rangeConfig: { [key: number]: RangeConfig };
  onBtnChange?: Function;
  isVertical?: boolean;
  contentHeight?: number;
}

interface RangeConfig {
  explain: string;
  isShowInput: boolean;
  required: boolean;
  text: string;
}

export interface Option {
  text: string;
  hash: string;
  originText: string;
}

export type FormateConfigData = {
  id: string;
  title: string;
  expired: boolean;
  needLogin: boolean;
  submitTitle: string;
  questionList: Array<ControlProps>;
};

export const CONTROL_TYPES = [
  'radio',
  'radio-v',
  'radio-h',
  'checkbox',
  'checkbox-v',
  'checkbox-h',
  'text',
  'text-area',
  'textarea',
  'radio-star',
  'radio-grade',
];

export const QUESTION_CONTROL_TYPES = {
  RADIO: ['radio', 'radio-v', 'radio-h'],
  CHECKBOX: ['checkbox', 'checkbox-v', 'checkbox-h'],
  TEXT: ['text', 'text-area', 'textarea'],
  STAR: ['radio-star'],
  NPS: ['radio-grade'],
};

// 题型枚举
export enum QUESTION_TYPE {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  BINARY_CHOICE = 'binary-choice',
  RADIO_STAR = 'radio-star',
  RADIO_NPS = 'radio-nps',
  RADIO_GRADE = 'radio-grade',
  VOTE = 'vote',
  CASCADER = 'cascader',
}

// 题目类型标签映射对象
export const typeTagLabels: Record<QUESTION_TYPE, string> = {
  [QUESTION_TYPE.TEXT]: '单行输入框',
  [QUESTION_TYPE.TEXTAREA]: '多行输入框',
  [QUESTION_TYPE.RADIO]: '单选',
  [QUESTION_TYPE.CHECKBOX]: '多选',
  [QUESTION_TYPE.BINARY_CHOICE]: '判断',
  [QUESTION_TYPE.RADIO_STAR]: '评分',
  [QUESTION_TYPE.RADIO_NPS]: 'NPS评分',
  [QUESTION_TYPE.RADIO_GRADE]: 'NPS评分',
  [QUESTION_TYPE.VOTE]: '投票',
  [QUESTION_TYPE.CASCADER]: '多级联动',
};
