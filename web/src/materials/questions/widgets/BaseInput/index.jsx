import { defineComponent } from 'vue'
import './style.scss'

export default defineComponent({
  name: 'BaseInput',
  props: {
    uiTarget: {
      type: String,
      default: 'input'
    },
    customClass: {
      type: String,
      default: ''
    },
    field: {
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
  setup(props, { emit }) {
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
      onBlur,
      onInput,
      onFocus,
      onChange
    }
  },
  render() {
    const { uiTarget, customClass } = this

    return (
      <div class="input-wrapper">
        <uiTarget
          class={['input-box item-border', customClass]}
          type={this.type}
          name={this.name}
          field={this.field}
          readonly={this.readonly}
          placeholder={this.placeholder}
          value={this.value}
          maxlength={this.maxlength}
          minlength={this.minlength}
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
