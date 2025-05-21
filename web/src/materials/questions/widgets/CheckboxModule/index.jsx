import { computed, defineComponent, shallowRef, defineAsyncComponent, watch } from 'vue'
import { includes } from 'lodash-es'

import BaseChoice from '../BaseChoice'
import metaConfig from './meta.js'

export const meta = metaConfig
/**
 * 支持配置：
 * 排列方式, layout
 */
export default defineComponent({
  name: 'CheckBoxModule',
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
      type: Array,
      default: () => {
        return []
      }
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
    },
    maxNum: {
      type: [Number, String],
      default: 1
    },
    quotaDisplay:{
      type: Boolean,
      default: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const disableState = computed(() => {
      if (!props.maxNum) {
        return false
      }
      return props.value.length >= +props.maxNum
    })
    const isDisabled = (item) => {
      const { value } = props
      return disableState.value && !includes(value, item.hash)
    }
    const myOptions = computed(() => {
      const { options } = props
      return options.map((item) => {
        return {
          ...item,
          disabled: (item.release <= 0) || isDisabled(item)
        }
      })
    })
    // 兼容断点续答情况下选项配额为0的情况
    watch(() => myOptions, (value) => {
      const disabledHash = myOptions.value.filter(i => i.disabled).map(i => i.hash)
      if (value && disabledHash.length) {
        disabledHash.forEach(hash => {
          const index = value.indexOf(hash)
          if( index> -1) {
            const newValue = [...value]
            newValue.splice(index, 1)
            onChange(newValue)
          }
        })
      }
    })
    const onChange = (value) => {
      const key = props.field
      emit('change', {
        key,
        value
      })
    }
    const handleSelectMoreChange = (data) => {
      const { key, value } = data
      emit('change', {
        key,
        value
      })
    }

    const selectMoreView = shallowRef(null)
    if (props.readonly) {
      selectMoreView.value = defineAsyncComponent(
        () => import('@materials/questions/QuestionContainerB')
      )
    } else {
      selectMoreView.value = defineAsyncComponent(
        () => import('@materials/questions/QuestionRuleContainer')
      )
    }
    return {
      onChange,
      handleSelectMoreChange,
      disableState,
      myOptions,
      selectMoreView
    }
  },
  render() {
    const { readonly, field, myOptions, onChange, maxNum, value, quotaDisplay, selectMoreView } = this
    return (
      <BaseChoice
        uiTarget="checkbox"
        readonly={readonly}
        name={field}
        maxNum={maxNum}
        options={myOptions}
        onChange={onChange}
        value={value}
        layout={this.layout}
        quotaDisplay={quotaDisplay}
      >
        {{
          selectMore: (scoped) => {
            return (
              <selectMoreView
                readonly={this.readonly}
                showTitle={false}
                moduleConfig={scoped.selectMoreConfig}
                onChange={(e) => this.handleSelectMoreChange(e)}
              ></selectMoreView>
            )
          }
        }}
      </BaseChoice>
    )
  }
})
