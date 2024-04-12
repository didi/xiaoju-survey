import BaseChoice from '../BaseChoice';
import { computed, defineComponent } from 'vue';
import QuestionWithRule from '@/materials/questions/widgets/QuestionRuleContainer';
import { includes } from 'lodash-es';
import metaConfig from './meta.js';
export const meta = metaConfig;
/**
 * 支持配置：
 * 排列方式, layout
 */
export default defineComponent({
  name: 'CheckBoxModule',
  components: { BaseChoice, QuestionWithRule },
  props: {
    type: {
      type: String,
      default: '',
    },
    field: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    layout: {
      type: String,
      default: 'vertical',
    },
    options: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    maxNum: {
      type: [Number, String],
      default: 1,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const disableState = computed(() => {
      if (!props.maxNum) {
        return false;
      }
      return props.value.length >= +props.maxNum;
    });
    const isDisabled = (item) => {
      const { value } = props;
      return disableState.value && !includes(value, item.value);
    };
    const myOptions = computed(() => {
      const { options } = props;
      return options.map((item) => {
        return {
          ...item,
          disabled: isDisabled(item),
        };
      });
    });
    const onChange = (value) => {
      const key = props.field;
      emit('change', {
        key,
        value,
      });
    };
    const handleSelectMoreChange = (data) => {
      const { key, value } = data;
      emit('change', {
        key,
        value,
      });
    };
    return {
      props,
      onChange,
      handleSelectMoreChange,
      myOptions,
    };
  },
  render() {
    const { readonly, field, myOptions, onChange, props } = this;

    // const props = {
    //   ...this.$props,
    //   readonly,
    //   name: field,
    //   options: myOptions,
    // };
    return (
      <BaseChoice
        uiTarget="checkbox"
        readonly={readonly}
        name={field}
        options={myOptions}
        onChange={onChange}
        value={props.value}
      >
        {{
          selectMore: (scoped) => {
            return (
              <QuestionWithRule
                readonly={this.readonly}
                showTitle={false}
                moduleConfig={scoped.selectMoreConfig}
                onChange={(e) => this.handleSelectMoreChange(e)}
              ></QuestionWithRule>
            );
          },
        }}
      </BaseChoice>
    );
  },
});
