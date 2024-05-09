import { defineComponent, ref } from 'vue'
import { get } from 'lodash-es'

import BaseInput from '../BaseInput'

import './style.scss'
import myMeta from './meta'

export const meta = myMeta
/**
 * 支持配置：
 * 内容限制格式，valid
 * 字数限制，textRange
 * 引导提示文案，placeholder
 */
export default defineComponent({
  name: 'InputModule',
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
  emits: ['blur', 'focus', 'input', 'change'],
  setup(props, { emit }) {
    const focusFlag = ref(false)
    const initial = props.textRange.max.value - props.value.length
    const getLeftTextNumber = ref(initial)
    const onBlur = () => {
      emit('blur')
    }
    const onFocus = () => {
      if (props.type !== 'mob' && (props.valid === '' || props.valid === 'n')) {
        focusFlag.value = true
      }
      emit('focus')
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
      props,
      focusFlag,
      getLeftTextNumber,
      onBlur,
      onFocus,
      onInput,
      onChange
    }
  },
  render() {
    const { focusFlag, getLeftTextNumber, valid, textRange, props } = this

    return (
      <div>
        <BaseInput
          uiTarget="input"
          type={valid === 'n' ? 'number' : 'text'}
          field={props.field}
          name={props.field}
          value={props.value}
          placeholder={props.placeholder}
          textRange={props.textRange}
          maxlength={textRange.max.value}
          minlength={textRange.min.value}
          valid={props.valid}
          readonly={props.readonly}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onInput={this.onInput}
          onChange={this.onChange}
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
