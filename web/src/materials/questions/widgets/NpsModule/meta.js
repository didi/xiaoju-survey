import basicConfig from '../../common/config/basicConfig';
import { Message } from 'element-ui';

const meta = {
  title: '评分',
  questExtra: ['listenMerge'],
  type: 'radio-nps',
  componentName: 'NpsModule',
  formConfig: [
    basicConfig,
    {
      name: 'min',
      label: 'NPS量表最小值',
      labelStyle: {
        'font-weight': 'bold',
      },
      contentClass: 'nps-select-config',
      key: 'min',
      type: 'Select',
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => ({
        value: v,
        label: v,
      })),
      valueSetter: (val, moduleConfig) => {
        if (moduleConfig['max'] && val >= moduleConfig['max']) {
          Message({
            type: 'info',
            message: '最小值不可大于最大值',
          });
          return true;
        }
      },
    },
    {
      name: 'max',
      label: 'NPS量表最大值',
      labelStyle: {
        'font-weight': 'bold',
      },
      key: 'max',
      type: 'Select',
      contentClass: 'nps-select-config',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => ({
        value: v,
        label: v,
      })),
      valueSetter: (val, moduleConfig) => {
        if (moduleConfig['min'] && val <= moduleConfig['min']) {
          Message({
            type: 'info',
            message: '最大值不可小于最小值',
          });
          return true;
        }
      },
    },
    {
      name: 'npsMsg',
      label: 'NPS两级文案',
      labelStyle: {
        'font-weight': 'bold',
      },
      contentClass: 'nps-customed-config',
      type: 'Customed',
      content: [
        {
          label: '最小值文案',
          type: 'Input',
          key: 'minMsg',
          direction: 'horizon',
          placeholder: '极不满意',
        },
        {
          label: '最大值文案',
          type: 'Input',
          key: 'maxMsg',
          direction: 'horizon',
          placeholder: '十分满意',
        },
      ],
    },
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
