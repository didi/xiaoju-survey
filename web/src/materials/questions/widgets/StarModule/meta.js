import basicConfig from '../../common/config/basicConfig';

const meta = {
  title: '评分',
  questExtra: ['listenMerge'],
  type: 'radio-star',
  componentName: 'StarModule',
  formConfig: [
    // {
    //   name: 'fieldId',
    //   label: '题目ID',
    //   type: 'Input',
    //   placeholder: '',
    //   key: 'field',
    //   tip: '请谨慎修改题目ID，并保证此ID在整个问卷中唯一',
    //   relyField: 'questionIdCustomize',
    //   noNeedRelyClean: true
    // },
    // {
    //   name: 'questionLabel',
    //   label: '题目标签',
    //   type: 'Input',
    //   placeholder: '',
    //   key: 'label',
    //   tip: '请谨慎修改题目标签，并保证此标签在整个问卷中唯一',
    //   relyField: 'questionLabelCustomize',
    //   noNeedRelyClean: true
    // },
    // {
    //   name: 'titleOrigin',
    //   label: '标题引用其他题目选项',
    //   type: 'TitleOrigin',
    //   options: [],
    //   key: 'title'
    // },
    basicConfig,
    {
      name: 'starConfig',
      label: '评分显示样式',
      labelStyle: {
        'font-weight': 'bold',
      },
      type: 'RadioGroup',
      key: 'starStyle',
      options: [
        {
          label: [1, 2, 3, 4, 5]
            .map(
              () =>
                `<i class='qicon qicon-xingxing' style='margin-right: 4px;'></i>`
            )
            .join(''),
          value: 'star',
        },
        {
          label: [1, 2, 3, 4, 5]
            .map(
              () =>
                `<i class='qicon qicon-aixin' style='margin-right: 4px;'></i>`
            )
            .join(''),
          value: 'love',
        },
        {
          label: `1  2  3  4  5`,
          value: 'number',
        },
      ],
    },
    // {
    //   name: 'starMin',
    //   label: '评分最小值',
    //   type: 'InputNumber',
    //   key: 'starMin',
    //   direction: 'horizon',
    //   value: '',
    //   min: data => Math.max(data.starMax - 10, -10),
    //   max: 'starMax',
    //   relyFunc: data => data.starStyle === 'number',
    // },
    // {
    //   name: 'starMax',
    //   label: '评分最大值',
    //   type: 'InputNumber',
    //   key: 'starMax',
    //   direction: 'horizon',
    //   value: '',
    //   min: 'starMin',
    //   max: data => Math.min(data.starMin + 10, 10),
    //   relyFunc: data => data.starStyle === 'number',
    // },
    // {
    //   name: 'starMaxSingle',
    //   label: '评分最大值',
    //   type: 'InputNumber',
    //   key: 'starMax',
    //   direction: 'horizon',
    //   value: 5,
    //   min: 1,
    //   max: 10,
    //   relyFunc: data => data.starStyle !== 'number',
    // },
  ],
  editConfigure: {
    optionEdit: {
      show: false,
    },
    optionEditBar: {
      show: true,
      configure: {
        showOthers: false,
        showAdvancedRateConfig: true,
      },
    },
  },
};

export default meta;
