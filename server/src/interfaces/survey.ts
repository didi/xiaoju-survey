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
}

export interface Option {
  text: string;
  others: boolean;
  mustOthers?: boolean;
  othersKey?: string;
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

// 白名单类型
export enum WhitelistType {
  ALL = 'ALL',
  // 空间成员
  MEMBER = 'MEMBER',
  // 自定义
  CUSTOM = 'CUSTOM',
}

// 白名单用户类型
export enum MemberType {
  // 手机号
  MOBILE = 'MOBILE',
  // 邮箱
  EMAIL = 'EMAIL',
}

export interface BaseConf {
  beginTime: string;
  endTime: string;
  answerBegTime: string;
  answerEndTime: string;
  tLimit: number;
  language: string;
  // 访问密码开关
  passwordSwitch?: boolean;
  // 密码
  password?: string | null;
  // 白名单类型
  whitelistType?: WhitelistType;
  // 白名单用户类型
  memberType?: MemberType;
  // 白名单列表
  whitelist?: string[];
  // 提示语
  whitelistTip?: string;
}

export interface SkinConf {
  skinColor: string;
  inputBgColor: string;
  backgroundConf: {
    color: string;
    type: string;
    image: string;
  };
  contentConf: {
    opacity: number;
  };
  themeConf: {
    color: string;
  };
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
