import { ResponseSchema } from 'src/models/responseSchema.entity';
import { RECORD_STATUS, RECORD_SUB_STATUS } from 'src/enums';
import { ObjectId } from 'mongodb';

export const mockResponseSchema: ResponseSchema = {
  _id: new ObjectId('65f29f8892862d6a9067ad25'),
  curStatus: {
    status: RECORD_STATUS.PUBLISHED,
    date: 1710399368439,
  },
  subStatus: {
    status: RECORD_SUB_STATUS.DEFAULT,
    date: 1710399368439,
  },
  statusList: [
    {
      status: RECORD_STATUS.PUBLISHED,
      date: 1710399368439,
    },
  ],
  createdAt: 1710399368440,
  updatedAt: 1710399368440,
  title: '加密全流程',
  surveyPath: 'EBzdmnSp',
  code: {
    bannerConf: {
      titleConfig: {
        mainTitle:
          '<h3 style="text-align: center">欢迎填写问卷</h3><p>为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，<span style="color: rgb(204, 0, 0)">期待您的参与！</span></p>',
        subTitle: '',
      },
      bannerConfig: {
        bgImage: '/imgs/skin/17e06b7604a007e1d3e1453b9ddadc3c.webp',
        videoLink: '',
        postImg: '',
      },
    },
    baseConf: {
      beginTime: '2024-03-14 14:54:41',
      endTime: '2034-03-14 14:54:41',
      language: 'chinese',
      tLimit: 10,
      answerBegTime: '',
      answerEndTime: '',
    },
    bottomConf: {
      logoImage: '/imgs/Logo.webp',
      logoImageWidth: '60%',
    },
    skinConf: {
      backgroundConf: {
        color: '#fff',
        type: 'color',
        image: '',
      },
      themeConf: {
        color: '#ffa600',
      },
      contentConf: {
        opacity: 100,
      },
      skinColor: '#4a4c5b',
      inputBgColor: '#ffffff',
    },
    submitConf: {
      submitTitle: '提交',
      msgContent: {
        msg_200: '提交成功',
        msg_9001: '您来晚了，感谢支持问卷~',
        msg_9002: '请勿多次提交！',
        msg_9003: '您来晚了，已经满额！',
        msg_9004: '提交失败！',
      },
      confirmAgain: {
        is_again: true,
        again_text: '确认要提交吗？',
      },
    },
    dataConf: {
      dataList: [
        {
          isRequired: true,
          showIndex: true,
          showType: true,
          showSpliter: true,
          type: 'text',
          valid: '',
          field: 'data458',
          title: '<p>您的手机号</p>',
          placeholder: '',
          randomSort: false,
          checked: false,
          minNum: '',
          maxNum: '',
          star: 5,
          nps: {
            leftText: '极不满意',
            rightText: '极满意',
          },
          placeholderDesc: '',
          textRange: {
            min: {
              placeholder: '0',
              value: 0,
            },
            max: {
              placeholder: '500',
              value: 500,
            },
          },
        },
        {
          isRequired: true,
          showIndex: true,
          showType: true,
          showSpliter: true,
          type: 'radio',
          placeholderDesc: '',
          field: 'data515',
          title: '<p>您的性别</p>',
          placeholder: '',
          randomSort: false,
          checked: false,
          minNum: '',
          maxNum: '',
          options: [
            {
              text: '<p>男</p>',
              others: false,
              mustOthers: false,
              othersKey: '',
              placeholderDesc: '',
              hash: '115019',
            },
            {
              text: '<p>女</p>',
              others: false,
              mustOthers: false,
              othersKey: '',
              placeholderDesc: '',
              hash: '115020',
            },
          ],
          importKey: 'single',
          importData: '',
          cOption: '',
          cOptions: [],
          nps: {
            leftText: '极不满意',
            rightText: '极满意',
          },
          star: 5,
          exclude: false,
          textRange: {
            min: {
              placeholder: '0',
              value: 0,
            },
            max: {
              placeholder: '500',
              value: 500,
            },
          },
        },
        {
          field: 'data450',
          showIndex: true,
          showType: true,
          showSpliter: true,
          type: 'text',
          placeholderDesc: '',
          title: '<p>身份证</p>',
          placeholder: '',
          valid: '',
          isRequired: true,
          checked: false,
          minNum: '',
          maxNum: '',
          starStyle: 'star',
          rangeConfig: {},
          star: 5,
          textRange: {
            min: {
              placeholder: '0',
              value: 0,
            },
            max: {
              placeholder: '500',
              value: 500,
            },
          },
        },
        {
          field: 'data405',
          showIndex: true,
          showType: true,
          showSpliter: true,
          type: 'text',
          placeholderDesc: '',
          title: '<p>地址</p>',
          placeholder: '',
          valid: '',
          isRequired: true,
          checked: false,
          minNum: '',
          maxNum: '',
          starStyle: 'star',
          rangeConfig: {},
          star: 5,
          textRange: {
            min: {
              placeholder: '0',
              value: 0,
            },
            max: {
              placeholder: '500',
              value: 500,
            },
          },
        },
        {
          field: 'data770',
          showIndex: true,
          showType: true,
          showSpliter: true,
          type: 'text',
          placeholderDesc: '',
          title: '<p>邮箱</p>',
          placeholder: '',
          valid: '',
          isRequired: true,
          randomSort: false,
          checked: false,
          minNum: '',
          maxNum: '',
          starStyle: 'star',
          rangeConfig: {},
          star: 5,
          textRange: {
            min: {
              placeholder: '0',
              value: 0,
            },
            max: {
              placeholder: '500',
              value: 500,
            },
          },
        },
      ],
    },
  },
  pageId: '65f29f3192862d6a9067ad1c',
} as unknown as ResponseSchema;
