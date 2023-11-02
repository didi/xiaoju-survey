import basicConfig from '../../common/config/basicConfig';

const meta = {
  title: '判断题',
  type: 'binary-choice',
  componentName: 'BinaryChoiceModule',
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
  ],
  editConfigure: {
    optionEdit: {
      show: false,
    },
    optionEditBar: {
      show: false,
      configure: {
        showOthers: false,
        showAdvancedConfig: false,
      },
    },
  },
};

export default meta;
