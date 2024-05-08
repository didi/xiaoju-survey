import { computed, defineComponent, onMounted, shallowRef, ref } from 'vue'

import questionLoader from '@/materials/questions/questionLoader.js'

import moduleList from '../common/config/moduleList.js'
import '../common/css/question.scss'

import EditOptions from './EditOptions.jsx'
import EditTitle from './EditTitle.jsx'

export const getBlockComponent = async (type) => {
  const path = moduleList[type]
  const componentRes = await questionLoader.loadComponent(type, path)
  const meta = await questionLoader.loadMeta(type)
  return { componentRes, meta }
}

export default defineComponent({
  name: 'QuestionContainerB',
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
  emits: ['blur', 'focus', 'change', 'select'],
  setup(props, { emit }) {
    const BlockComponent = shallowRef(null)

    const questionMeta = ref({})

    onMounted(async () => {
      const { componentRes, meta } = await getBlockComponent(props.type)
      BlockComponent.value = componentRes.component
      questionMeta.value = meta
    })
    // 根据选中状态和是否meta中的编辑态配置判断是否显示编辑态
    const showEditComponent = computed(() => {
      let result = false
      if (props.isSelected) {
        const { editConfigure = { optionEdit: { show: false } } } = questionMeta.value
        result = editConfigure?.optionEdit?.show
      }
      return result
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
    const onClick = () => {
      emit('select', props.indexNumber)
    }

    return {
      questionMeta,
      props,
      BlockComponent,
      onClick,
      onBlur,
      onFocus,
      onChange,
      showEditComponent
    }
  },
  render() {
    const { isSelected } = this

    const props = {
      isSelected,
      ...this.moduleConfig,
      ...this.$props
    }

    const { BlockComponent } = this
    let dynamicComponent = <span> 题型组件加载中</span>
    if (BlockComponent) {
      dynamicComponent = BlockComponent
    }
    return (
      <div class={['question', isSelected ? 'isSelected' : '']}>
        {this.showTitle && <EditTitle {...props} onChange={this.onChange} />}

        <div class="question-block">
          {this.showEditComponent ? (
            <EditOptions moduleConfig={props.moduleConfig}></EditOptions>
          ) : (
            // 输入类题目
            <dynamicComponent
              readonly
              {...props}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              change={this.onChange}
            />
          )}
        </div>
      </div>
    )
  }
})
