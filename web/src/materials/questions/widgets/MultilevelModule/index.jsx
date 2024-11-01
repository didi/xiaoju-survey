import { defineComponent} from 'vue'
import BaseMultilevel from './BaseMultilevel/index.vue'

export default defineComponent({
  name: 'MultilevelModule',
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
    multilevelData: {
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
      <BaseMultilevel multilevelData={props.multilevelData} readonly={props.readonly} value={props.value} onChange={this.onChange}   />
    )
  }
})