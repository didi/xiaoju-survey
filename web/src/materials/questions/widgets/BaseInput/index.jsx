import { defineComponent } from 'vue'
import './style.scss'

export default defineComponent({
  name: 'BaseInput',
  props: {
    uiTarget: {
      type: String,
      default: 'radio'
    },
    customClass: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请填写'
    },
    maxlength: {
      type: Number,
      default: 500
    },
    minlength: {
      type: Number,
      default: 0
    },
    value: {
      type: String,
      default: ''
    }
  },
  emits: ['input', 'change', 'blur', 'focus'],
  setup(props, { emit, slots }) {
    const onBlur = () => {
      emit('blur')
    }
    const onInput = (e) => {
      emit('input', e)
    }
    const onChange = (e) => {
      emit('change', e)
    }
    const onFocus = () => {
      if (props.readonly) return false
      emit('focus')
    }
    return {
      props,
      slots,
      onBlur,
      onInput,
      onFocus,
      onChange
    }
  },
  render() {
    const { uiTarget, customClass, props } = this

    return (
      <div class="input-wrapper">
        <uiTarget
          class={['input-box item-border', customClass]}
          type={props.type}
          name={props.name}
          field={props.field}
          readonly={props.readonly}
          placeholder={props.placeholder}
          value={props.value}
          maxlength={props.maxlength}
          minlength={props.minlength}
          autocomplete={'off'}
          onInput={this.onInput}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
        />
      </div>
    )
  }
})
