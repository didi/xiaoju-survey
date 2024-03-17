import baseChoice from '../BaseChoice';
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
  components: { baseChoice, QuestionWithRule },
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
      onChange,
      handleSelectMoreChange,
      myOptions,
    };
  },
  render() {
    const { readonly, field, myOptions } = this;

    const props = {
      ...this.$props,
      readonly,
      name: field,
      options: myOptions,
    };
    return (
      <baseChoice
        uiTarget="checkbox"
        {...{ props: props }}
        {...{
          on: {
            change: this.onChange,
          },
        }}
        scopedSlots={{
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
      ></baseChoice>
    );
  },
});
