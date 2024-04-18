import BaseChoice from '../BaseChoice';
import { defineComponent } from 'vue';
import metaConfig from './meta.js';
export const meta = metaConfig;
/**
 * 支持配置：
 * 排列方式, layout
 */
export default defineComponent({
  name: 'BinaryChoiceModule',
  components: { BaseChoice },
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
      props,
      onChange,
    };
  },
  render() {
    const { props } = this;
    return (
      <BaseChoice
        uiTarget="radio"
        type={props.type}
        readonly={props.readonly}
        name={props.field}
        field={props.field}
        value={props.value}
        layout={props.layout}
        options={props.options}
        onChange={this.onChange}
      ></BaseChoice>
    );
  },
});
