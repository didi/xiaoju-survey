import basicConfig from '../../common/config/basicConfig';

const meta = {
  title: '投票',
  type: 'vote',
  componentName: 'VoteModule',
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
      name: 'optionConfig',
      label: '选项配置',
      labelStyle: {
        'font-weight': 'bold',
      },
      type: 'Customed',
      key: 'optionConfig',
      content: [
        // {
        //   label: '选项随机排序',
        //   type: 'CheckBox',
        //   key: 'randomSort',
        //   direction: 'horizon',
        //   value: false,
        //   contentPosition: 'before',
        //   contentClass: 'check-box-config'
        // },
        // {
        //   label: '默认选中第一项',
        //   type: 'CheckBox',
        //   key: 'checked',
        //   direction: 'horizon',
        //   value: false,
        //   contentPosition: 'before',
        //   contentClass: 'check-box-config'
        // },
        {
          label: '设置为多选题',
          type: 'CheckBox',
          key: 'innerType',
          direction: 'horizon',
          value: false,
          contentPosition: 'before',
          inline: true,
          // 输入转换
          valueAdapter({ moduleConfig }) {
            if (moduleConfig.innerType === 'checkbox') {
              return true;
            } else {
              return false;
            }
          },
          // 输出转换
          setterAdapter({ value }) {
            return {
              key: 'innerType',
              value: value ? 'checkbox' : 'radio',
            };
          },
        },
        // {
        //   label: '展示选项余量',
        //   type: 'CheckBox',
        //   key: 'showLeftNum',
        //   direction: 'horizon',
        //   value: true,
        //   include: ['appointment'],
        //   contentPosition: 'before',
        //   contentClass: 'check-box-config'
        // },
        // {
        //   name: 'inputType',
        //   label: '切换题型',
        //   type: 'Radio',
        //   key: 'selectType',
        //   direction: 'horizon',
        //   value: '',
        //   options: [
        //     {
        //       label: '单选',
        //       value: 'radio'
        //     },
        //     {
        //       label: '多选',
        //       value: 'checkbox'
        //     }
        //   ],
        //   contentClass: 'radio-config'
        // },
        // {
        //   label: '排列方式',
        //   type: 'Radio',
        //   key: 'sortWay',
        //   direction: 'horizon',
        //   value: '',
        //   options: [
        //     {
        //       label: '竖排',
        //       value: 'v'
        //     },
        //     {
        //       label: '横排',
        //       value: 'h'
        //     }
        //   ],
        //   contentClass: 'radio-config'
        // },
        {
          label: '至少选择数',
          type: 'InputNumber',
          key: 'minNum',
          direction: 'horizon',
          value: '',
          min: 0,
          max: 'maxNum',
          contentClass: 'input-number-config',
        },
        {
          label: '最多选择数',
          type: 'InputNumber',
          key: 'maxNum',
          direction: 'horizon',
          value: '',
          min: 'minNum',
          contentClass: 'input-number-config',
        },
      ],
    },
    // {
    //   name: 'optionOrigin',
    //   label: '选项引用其他题目选项',
    //   type: 'Select',
    //   options: [],
    //   key: 'optionOrigin',
    //   tip: '支持引用多选题、单选题、矩阵单选题'
    // },
    // {
    //   name: 'originType',
    //   label: '',
    //   type: 'Select',
    //   options: [
    //     {
    //       label: '选中项',
    //       value: 'selected'
    //     },
    //     {
    //       label: '未选中项',
    //       value: 'noSelected'
    //     }
    //   ],
    //   key: 'originType'
    // },
  ],
  editConfigure: {
    optionEdit: {
      show: true,
    },
    optionEditBar: {
      show: true,
      configure: {
        showOthers: false,
        showAdvancedConfig: true,
      },
    },
  },
};

export default meta;
