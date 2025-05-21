import { defineComponent, shallowRef, watch, defineAsyncComponent, computed } from 'vue'
import BaseChoice from '../BaseChoice'

/**
 * 支持配置：
 * 排列方式, layout
 */
export default defineComponent({
  name: 'RadioModule',
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
    },
    quotaDisplay:{
      type: Boolean,
      default: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const myOptions = computed(() => {
      const { options } = props
      return options.map((item) => {
        return {
          ...item,
          disabled: (item.release <= 0) || item.disabled,
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
    // 填写更多传入一个动态组件
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
      myOptions,
      onChange,
      handleSelectMoreChange,
      selectMoreView
    }
  },
  render() {
    const { selectMoreView } = this

    return (
      <div>
        <BaseChoice
          uiTarget="radio"
          readonly={this.readonly}
          name={this.field}
          options={this.myOptions}
          value={this.value}
          type={this.type}
          field={this.field}
          layout={this.layout}
          onChange={this.onChange}
          quotaDisplay={this.quotaDisplay}
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
      </div>
    )
  }
})
