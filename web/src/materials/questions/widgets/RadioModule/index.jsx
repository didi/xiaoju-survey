import { defineComponent, shallowRef, defineAsyncComponent } from 'vue'
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
    noDisplay:{
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
          options={this.options}
          value={this.value}
          type={this.type}
          field={this.field}
          layout={this.layout}
          onChange={this.onChange}
          noDisplay={this.noDisplay}
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
