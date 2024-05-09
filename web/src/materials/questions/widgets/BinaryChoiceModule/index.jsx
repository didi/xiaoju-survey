import { defineComponent } from 'vue'
import BaseChoice from '../BaseChoice'
import metaConfig from './meta.js'

export const meta = metaConfig
/**
 * 支持配置：
 * 排列方式, layout
 */
export default defineComponent({
  name: 'BinaryChoiceModule',
  props: {
    type: {
      type: String,
      default: ''
    },
    field: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    layout: {
      type: String,
      default: 'vertical'
    },
    options: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const onChange = (value) => {
      const key = props.field
      emit('change', {
        key,
        value
      })
    }
    return {
      props,
      onChange
    }
  },
  render() {
    return (
      <BaseChoice
        uiTarget="radio"
        type={this.type}
        readonly={this.readonly}
        name={this.field}
        field={this.field}
        value={this.value}
        layout={this.layout}
        options={this.options}
        onChange={this.onChange}
      ></BaseChoice>
    )
  }
})
