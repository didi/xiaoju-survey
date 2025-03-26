/*
 * 本文件为问卷业务协议规范，代码中未实际使用
 * https://xiaojusurvey.didi.cn/docs/next/agreement/%E3%80%8A%E9%97%AE%E5%8D%B7%E4%B8%9A%E5%8A%A1%E5%8D%8F%E8%AE%AE%E8%A7%84%E8%8C%83%E3%80%8B
 */
export interface SurveySepc {
  version: string; // 版本号
  baseConf: BaseConfSpec; // 基本配置
  dataConf: DataConfSpec; // 题目配置
  submitConf: SubmitConfSpec; // 提交设置
  bannerConf: BannerConfSpec; // 页面头部设置
  bottomConf: BottomConfSpec; // 页面尾部设置
  skinConf: any; // 样式设置
}

export interface BaseConfSpec {
  begTime: string;
  endTime: string;
  answerBegTime: string;
  answerEndTime: string;
  answerLimitTime: string;
  tLimit: string;
  language: 'chinese';
  showVoteProcess: 'allow' | 'notallow';
}

export interface DataConfSpec {
  dataList: any[];
}

export type DataSpec = DataBaseSpec &
  DataInputSpec &
  DataOptionsSpec &
  DataScoreSpec;

export interface DataBaseSpec {
  field: string;
  type: string;
  title: string;
  isRequired: boolean;
  showType: boolean;
  showIndex: boolean;
  showSpliter: boolean;
}

export type DataInputValid = '*' | 'n' | 'm' | 'e' | 'idcard' | 'licensePlate';
export type RangeDesc = {
  value: number;
  placeholder: string;
};

export interface DataInputSpec {
  valid: DataInputValid;
  textRange?: {
    min: RangeDesc;
    max: RangeDesc;
  };
  numberRange?: {
    min: RangeDesc;
    max: RangeDesc;
  };
  placeholder?: string;
}

export interface DataOptionsSpec {
  options: {
    hash: string;
    text: string;
    others: boolean;
    othersKey: string;
    mustOthers: boolean;
    mutex: boolean;
    placeholder: string;
  }[];
  minNum?: number;
  maxNum?: number;
}

export interface DataScoreSpec {
  rangeConfig: {
    [key: string | number]: {
      isShowInput: boolean;
      required: boolean;
      text: string;
      explain: string;
    };
  };
  starMin?: number;
  starMax?: number;
  starStyle?: string;
  min: number;
  max: number;
  minMsg: string;
  maxMsg: string;
}

export interface SubmitConfSpec {
  submitTitle: string;
  msgContent: {
    msg_200: string;
    msg_9003: string;
    msg_9004: string;
  };
  confirmAgain: {
    isAgain: boolean;
  };
  buttonList: {
    title: string;
    url: string;
  }[];
}

export interface BannerConfSpec {
  titleConfig: {
    mainTitle: string;
    subTitle: string;
    applyTitle: string;
  };
  bannerConfig: {
    bgImage: string;
    bgImageAllowJump: boolean;
    bgImageJumpLink: string;
    videoLink: string;
    postImg: string;
  };
}

export interface BottomConfSpec {
  logoImage: string;
  logoImageWidth: number;
}

export interface SkinConfSpec {
  skinColor: string;
  inputBgColor: string;
}
