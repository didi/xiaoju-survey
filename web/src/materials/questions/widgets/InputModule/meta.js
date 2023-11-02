import basicConfig from '../../common/config/basicConfig';

export const meta = {
  title: '单行输入框',
  questExtra: ['listenMerge'],
  type: 'text',
  componentName: 'InputModule',
  formConfig: [
    // {
    //   name: 'fieldId',
    //   label: '题目ID',
    //   type: 'Input',
    //   placeholder: '',
    //   key: 'field',
    //   tip: '请谨慎修改题目ID，并保证此ID在整个问卷中唯一',
    //   relyField: 'questionIdCustomize',
    //   noNeedRelyClean: true,
    // },
    // {
    //   name: 'questionLabel',
    //   label: '题目标签',
    //   type: 'Input',
    //   placeholder: '',
    //   key: 'label',
    //   tip: '请谨慎修改题目标签，并保证此标签在整个问卷中唯一',
    //   relyField: 'questionLabelCustomize',
    //   noNeedRelyClean: true,
    // },
    // {
    //   name: 'titleOrigin',
    //   label: '标题引用其他题目选项',
    //   type: 'TitleOrigin',
    //   options: [],
    //   key: 'title',
    // },
    basicConfig,
    {
      name: 'valid',
      label: '内容限制格式',
      labelStyle: {
        'font-weight': 'bold',
      },
      type: 'Select',
      key: 'valid',
      options: [
        {
          label: '请选择',
          value: '',
        },
        {
          label: '手机号',
          value: 'm',
        },
        {
          label: '身份证',
          value: 'idcard',
        },
        {
          label: '数字',
          value: 'n',
        },
        {
          label: '邮箱',
          value: 'e',
        },
        {
          label: '车牌号',
          value: 'licensePlate',
        },
      ],
    },
    // {
    //   name: 'qQuestionLimit',
    //   label: '相同填写内容提交次数',
    //   type: 'QuestionLimit',
    //   key: 'qQuestionLimit',
    //   value: {
    //     type: 0,
    //     limit: 0,
    //   },
    // },
    {
      name: 'numberRange',
      label: '数字限制',
      labelStyle: {
        'font-weight': 'bold',
      },
      type: 'Range',
      options: [],
      key: 'numberRange',
      value: [],
      cleanKeys: {
        numberRange: {
          min: {
            placeholder: '0',
            value: 0,
          },
          max: {
            placeholder: '1000',
            value: 1000,
          },
        },
      },
      relyFunc: (data) => data.valid && data.valid === 'n',
    },
    {
      name: 'textRange',
      label: '字数限制',
      labelStyle: {
        'font-weight': 'bold',
      },
      type: 'Range',
      options: [],
      key: 'textRange',
      value: [],
    },
    // {
    //   name: 'inputType',
    //   label: '切换题型',
    //   type: 'Radio',
    //   key: 'type',
    //   direction: 'horizon',
    //   value: '',
    //   options: [
    //     {
    //       label: '单行',
    //       value: 'text',
    //     },
    //     {
    //       label: '多行',
    //       value: 'textarea',
    //     },
    //   ],
    //   contentClass: 'radio-config',
    // },
    {
      name: 'placeholder',
      label: '引导提示文案',
      labelStyle: {
        'font-weight': 'bold',
      },
      type: 'Input',
      placeholder: '限制20字',
      key: 'placeholder',
      tip: '限制20字',
      validate(value) {
        if (value && value.length > 20) {
          console.warn('引导提示文案字数不能超过20个字，请修改后重新保存');
          return false;
        }
        return true;
      },
    },
  ],
};

export default meta;
