import { ObjectId } from 'mongodb';
import { getPushingData } from '../messagePushing';
import { RECORD_STATUS } from 'src/enums';

describe('getPushingData', () => {
  it('should combine survey response data with response schema correctly', () => {
    const surveyResponse = {
      _id: new ObjectId('65fc2dd77f4520858046e129'),
      clientTime: 1711025112552,
      createDate: 1711025113146,
      curStatus: {
        status: RECORD_STATUS.NEW,
        date: 1711025113146,
      },
      diffTime: 30518,
      data: {
        data458: '15000000000',
        data515: '115019',
        data450: '450111000000000000',
        data405: '浙江省杭州市西湖区xxx',
        data770: '123456@qq.com',
      },
      optionTextAndId: {
        data515: [
          {
            hash: '115019',
            text: '<p>男</p>',
          },
          {
            hash: '115020',
            text: '<p>女</p>',
          },
        ],
      },
      pageId: '65f29f3192862d6a9067ad1c',
      statusList: [
        {
          status: RECORD_STATUS.NEW,
          date: 1711025113146,
        },
      ],

      surveyPath: 'EBzdmnSp',
      updateDate: 1711025113146,
      secretKeys: [],
    };

    // Mock response schema data
    const responseSchema = {
      _id: new ObjectId('65f29f8892862d6a9067ad25'),
      pageId: '65f29f3192862d6a9067ad1c',
      surveyPath: 'EBzdmnSp',
      code: {
        dataConf: {
          dataList: [
            {
              field: 'data458',
              title: '<p>您的手机号</p>',
            },
            {
              field: 'data515',
              title: '<p>您的性别</p>',
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
            },
            {
              field: 'data450',
              title: '<p>身份证</p>',
            },
            {
              field: 'data405',
              title: '<p>地址</p>',
            },
            {
              field: 'data770',
              title: '<p>邮箱</p>',
            },
          ],
        },
      },
    };

    const result = getPushingData({
      surveyResponse,
      questionList: responseSchema?.code?.dataConf?.dataList || [],
      surveyId: responseSchema.pageId,
      surveyPath: responseSchema.surveyPath,
    });
    // Assertions
    expect(result).toEqual({
      surveyId: responseSchema.pageId,
      surveyPath: responseSchema.surveyPath,
      surveyResponseId: surveyResponse._id.toString(),
      data: [
        {
          questionId: 'data458',
          title: '<p>您的手机号</p>',
          valueType: 'text',
          alias: '',
          value: ['15000000000'],
        },
        {
          questionId: 'data515',
          title: '<p>您的性别</p>',
          valueType: 'option',
          alias: '',
          value: [
            {
              alias: '',
              id: '115019',
              text: '<p>男</p>',
            },
          ],
        },
        {
          questionId: 'data450',
          title: '<p>身份证</p>',
          valueType: 'text',
          alias: '',
          value: ['450111000000000000'],
        },
        {
          questionId: 'data405',
          title: '<p>地址</p>',
          valueType: 'text',
          alias: '',
          value: ['浙江省杭州市西湖区xxx'],
        },
        {
          questionId: 'data770',
          title: '<p>邮箱</p>',
          valueType: 'text',
          alias: '',
          value: ['123456@qq.com'],
        },
      ],
    });
  });
});
