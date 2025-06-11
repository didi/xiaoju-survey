import { defineComponent, computed, shallowRef, defineAsyncComponent } from 'vue'
import BaseRate from '../BaseRate'
import './style.scss'

export default defineComponent({
  name: 'NpsModule',
  props: {
    field: {
      type: [String, Number],
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    },
    minMsg: {
      type: String,
      default: ''
    },
    maxMsg: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    rangeConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const rating = computed({
      get() {
        return props.value
      },
      set(val) {
        const key = props.field
        emit('change', {
          key,
          value: val
        })
      }
    })

    const confirmNps = (num) => {
      if (props.readonly) return
      rating.value = num
    }

    const minMessage = computed(() => {
      return props.minMsg || '极不满意'
    })

    const maxMessage = computed(() => {
      return props.maxMsg || '十分满意'
    })

    const indexValue = computed(() => {
      return props.value !== '' ? props.value : -1
    })
    const currentRangeConfig = computed(() => {
      return props.rangeConfig[rating.value]
    })
    const isShowInput = computed(() => {
      return currentRangeConfig.value?.isShowInput
    })

    const onMoreDataChange = (data) => {
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
      rating,
      confirmNps,
      minMessage,
      maxMessage,
      indexValue,
      isShowInput,
      onMoreDataChange,
      selectMoreView
    }
  },
  render() {
    const {
      field,
      rating,
      confirmNps,
      indexValue,
      minMessage,
      maxMessage,
      isShowInput,
      min,
      max,
      readonly,
      rangeConfig,
      onMoreDataChange,
      selectMoreView
    } = this

    return (
      <div class="nps-wrapper-main">
        <div class="nps-row-msg">
          <div class="nps-msg left">{minMessage}</div>
          <div class="nps-msg right">{maxMessage}</div>
        </div>
        <BaseRate
          name={field}
          min={min}
          max={max}
          readonly={readonly}
          value={indexValue}
          iconClass="number"
          onChange={confirmNps}
          class={!readonly ? 'radio-nps-hover' : ''}
        />
        {isShowInput && (
          <selectMoreView
            showTitle={false}
            key={`${field}_${rating}`}
            moduleConfig={{
              type: 'selectMoreModule',
              field: `${field}_${rating}`,
              placeholder: rangeConfig[rating]?.text,
              value: rangeConfig[rating]?.othersValue || ''
            }}
            onChange={(e) => onMoreDataChange(e)}
          ></selectMoreView>
        )}
      </div>
    )
  }
})
