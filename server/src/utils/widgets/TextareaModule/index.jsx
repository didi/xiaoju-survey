import { defineComponent, ref } from 'vue'
import { get } from 'lodash-es'

import BaseInput from '../BaseInput'
import myMeta from './meta'

import './style.scss'

export const meta = myMeta
/**
 * 支持配置：
 * 内容限制格式，valid
 * 字数限制，textRange
 * 引导提示文案，placeholder
 */
export default defineComponent({
  name: 'TextareaModule',
  props: {
    type: {},
    field: {},
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请填写'
    },
    textRange: {
      type: Object,
      default: () => {
        return {
          max: {
            placeholder: '500',
            value: 500
          },
          min: {
            placeholder: '0',
            value: 0
          }
        }
      }
    },
    valid: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change', 'blur', 'focus', 'input'],
  setup(props, { emit }) {
    const focusFlag = ref(false)
    const initial = props.textRange.max.value - props.value.length
    const getLeftTextNumber = ref(initial)
    const onFocus = () => {
      if (props.readonly) return
      if (props.type !== 'mob' && (props.valid === '' || props.valid === 'n')) {
        focusFlag.value = true
      }
      emit('focus')
    }
    const onBlur = () => {
      emit('blur')
    }
    const onInput = (e) => {
      if (props.type !== 'mob' && (props.valid === '' || props.valid === 'n')) {
        getLeftTextNumber.value = props.textRange.max.value - e.target.value.length
      }
      emit('input')
    }
    const onChange = (e) => {
      const key = props.field
      const maxLength = get(props, 'textRange.max.value')
      if (
        get(props, 'valid') === 'n' &&
        maxLength &&
        e.target.value.toString().length > maxLength
      ) {
        e.target.value = e.target.value.slice(0, props.textRange.max.value)
      }
      if (['m', 'idcard', 'e', 'licensePlate'].includes(props.valid)) {
        e.target.value = e.target.value.replace(/\s+/g, '')
      }
      emit('change', {
        key,
        value: e.target.value
      })
    }
    return {
      focusFlag,
      getLeftTextNumber,
      onBlur,
      onFocus,
      onInput,
      onChange
    }
  },
  render() {
    const { focusFlag, getLeftTextNumber, field, textRange } = this
    const props = {
      ...this.$props,
      value: this.value,
      name: field,
      maxlength: textRange.max.value,
      minlength: textRange.min.value
    }
    return (
      <div>
        <BaseInput
          uiTarget="textarea"
          customClass={focusFlag ? 'is-focused' : ''}
          {...props}
          {...{
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            onInput: this.onInput,
            onChange: this.onChange
          }}
        />

        {focusFlag && (
          <div class="text-number-tip">
            <p>{getLeftTextNumber}</p>
          </div>
        )}
      </div>
    )
  }
})
