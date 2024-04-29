import BaseChoice from '../BaseChoice'
import { defineComponent, shallowRef, defineAsyncComponent } from 'vue'

/**
 * 支持配置：
 * 排列方式, layout
 */
export default defineComponent({
  name: 'RadioModule',
  components: { BaseChoice },
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
    }
  },
  emits: ['focus', 'change', 'select', 'blur'],
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
    if(props.readonly) {
      selectMoreView.value = defineAsyncComponent(() => import('../QuestionContainerB.jsx'))
    } else {
      selectMoreView.value = defineAsyncComponent(() => import('../QuestionRuleContainer.jsx'))
    }
    return {
      props,
      onChange,
      handleSelectMoreChange,
      selectMoreView,
    }
  },
  render() {
    const { props, selectMoreView } = this

    return (
      <div>
        <BaseChoice
          uiTarget="radio"
          readonly={props.readonly}
          name={props.field}
          options={props.options}
          value={props.value}
          type={props.type}
          field={props.field}
          layout={props.layout}
          onChange={this.onChange}
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