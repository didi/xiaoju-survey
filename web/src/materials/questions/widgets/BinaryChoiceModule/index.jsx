import baseChoice from '../BaseChoice';
import { defineComponent } from 'vue';
import metaConfig from './meta.js';
export const meta = metaConfig;
/**
 * 支持配置：
 * 排列方式, layout
 */
export default defineComponent({
  name: 'BinaryChoiceModule',
  components: { baseChoice },
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
      type: String,
      default: '',
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
  },
  setup(props, { emit }) {
    const onChange = (value) => {
      const key = props.field;
      emit('change', {
        key,
        value,
      });
    };
    return {
      onChange,
    };
  },
  render() {
    const { readonly, field } = this;
    const props = {
      ...this.$props,
      readonly,
      name: field,
    };
    return (
      <baseChoice
        uiTarget="radio"
        {...{ props: props }}
        {...{
          on: {
            change: this.onChange,
          },
        }}
      ></baseChoice>
    );
  },
});
