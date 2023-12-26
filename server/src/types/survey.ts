export interface TitleConfig {
  mainTitle: string;
  subTitle: string;
}

export interface BannerConfig {
  bgImage: string;
  videoLink: string;
  postImg: string;
}

export interface BannerConf {
  titleConfig: TitleConfig;
  bannerConfig: BannerConfig;
}

export interface TimeStep {
  hour: number;
  min: number;
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
  valid: string;
  field: string;
  title: string;
  placeholder: string;
  randomSort: boolean;
  checked: boolean;
  minNum: string;
  maxNum: string;
  maxPhotos: number;
  star: number;
  timeStep: TimeStep;
  nps: NPS;
  placeholderDesc: string;
  addressType: number;
  isAuto: boolean;
  urlKey: string;
  textRange: TextRange;
  options?: Option[];
  importKey?: string;
  importData?: string;
  cOption?: string;
  cOptions?: string[];
  exclude?: boolean;
}

export interface Option {
  text: string;
  imageUrl: string;
  others: boolean;
  mustOthers: boolean;
  othersKey: string;
  placeholderDesc: string;
  hash: string;
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
  tLimit: string;
  language: string;
}

export interface SkinConf {
  skinColor: string;
  inputBgColor: string;
}

export interface ParsedData {
  bannerConf: BannerConf;
  dataConf: DataConf;
  submitConf: SubmitConf;
  baseConf: BaseConf;
  skinConf: SkinConf;
}
