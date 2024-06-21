// 问卷配置内容定义

export interface TitleConfig {
  mainTitle: string;
  subTitle: string;
}

export interface BannerConfig {
  bgImage: string;
  videoLink: string;
  postImg: string;
}

// 问卷头部内容：标题和头图
export interface BannerConf {
  titleConfig: TitleConfig;
  bannerConfig: BannerConfig;
}

export interface NPS {
  leftText: string;
  rightText: string;
}

export interface TextRange {
  min: {
    placeholder: string;
    value: number;
  };
  max: {
    placeholder: string;
    value: number;
  };
}

export interface DataItem {
  isRequired: boolean;
  showIndex: boolean;
  showType: boolean;
  showSpliter: boolean;
  type: string;
  valid?: string;
  field: string;
  title: string;
  placeholder: string;
  randomSort?: boolean;
  checked: boolean;
  minNum: string;
  maxNum: string;
  star: number;
  nps?: NPS;
  placeholderDesc: string;
  textRange?: TextRange;
  options?: Option[];
  importKey?: string;
  importData?: string;
  cOption?: string;
  cOptions?: string[];
  exclude?: boolean;
  rangeConfig?: any;
  starStyle?: string;
  innerType?: string;
  deleteRecover?: boolean;
  noDisplay?: boolean;
}

export interface Option {
  text: string;
  others: boolean;
  mustOthers?: boolean;
  othersKey?: string;
  placeholderDesc: string;
  hash: string;
  quota?: number;
}

export interface DataConf {
  dataList: DataItem[];
}

export interface ConfirmAgain {
  is_again: boolean;
  again_text: string;
}

export interface MsgContent {
  msg_200: string;
  msg_9001: string;
  msg_9002: string;
  msg_9003: string;
  msg_9004: string;
}

export interface SubmitConf {
  submitTitle: string;
  confirmAgain: ConfirmAgain;
  msgContent: MsgContent;
}

export interface BaseConf {
  begTime: string;
  endTime: string;
  answerBegTime: string;
  answerEndTime: string;
  tLimit: number;
  language: string;
}

export interface SkinConf {
  skinColor: string;
  inputBgColor: string;
}

export interface BottomConf {
  logoImage: string;
  logoImageWidth: string;
}

export interface SurveySchemaInterface {
  bannerConf: BannerConf;
  dataConf: DataConf;
  submitConf: SubmitConf;
  baseConf: BaseConf;
  skinConf: SkinConf;
  bottomConf: BottomConf;
}
