import { defineComponent, onMounted, shallowRef } from 'vue'

import questionLoader from '@/materials/questions/questionLoader.js'

import moduleList from '../common/config/moduleList.js'
import './style.scss'

import PreviewTitle from '../widgets/TitleModules/PreviewTitle'

export const getBlockComponent = async (type) => {
  const path = moduleList[type]
  const component = await questionLoader.loadComponent(type, path)

  return component
}

export default defineComponent({
  name: 'QuestionContainerC',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    indexNumber: {
      type: [Number, String],
      default: 1
    },
    moduleConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change', 'focus', 'blur'],
  setup(props, { emit }) {
    const BlockComponent = shallowRef(null)
    onMounted(async () => {
      const { component } = await getBlockComponent(props.type)
      BlockComponent.value = component
    })
    const onBlur = () => {
      emit('blur')
    }
    const onFocus = () => {
      emit('focus')
    }
    const onChange = (data) => {
      emit('change', data)
    }
    return {
      props,
      BlockComponent,
      onBlur,
      onFocus,
      onChange
    }
  },
  render() {
    const props = {
      ...this.moduleConfig,
      ...this.$props
    }
    const BlockComponent = this.BlockComponent
    return (
      <div class={['question']}>
        {this.showTitle && <PreviewTitle {...props} />}
        <div class="question-block">
          {this.BlockComponent ? (
            <BlockComponent
              readonly
              {...props}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onChange={this.onChange}
            />
          ) : (
            <span>题型控件加载中</span>
          )}
        </div>
      </div>
    )
  }
})
