import { defineComponent} from 'vue'
import BaseCascader from './BaseCascader/index.vue'

export default defineComponent({
  name: 'CascaderModule',
  props: {
    field: {
      type: [String, Number],
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    cascaderData: {
      type: Object,
      default: () => {}
    },
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
    const {  props } = this
    return (
      <BaseCascader cascaderData={props.cascaderData} readonly={props.readonly} value={props.value} onChange={this.onChange}   />
    )
  }
})