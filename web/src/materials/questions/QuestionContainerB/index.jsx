import { computed, defineComponent, onMounted, shallowRef, ref, provide } from 'vue'

import questionLoader from '@/materials/questions/questionLoader.js'

import moduleList from '../common/config/moduleList.js'
import './style.scss'

import EditOptions from '../widgets/EditOptions'
import EditTitle from '../widgets/TitleModules/EditTitle'

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
  setup(props, { slots, emit }) {
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
        result = editConfigure?.optionEdit?.show || editConfigure?.optionEditBar?.show
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

    // 透传高级组件
    provide('slots', {
      advancedEdit: slots.advancedEdit
    })

    return {
      props,
      BlockComponent,
      onBlur,
      onFocus,
      onChange,
      showEditComponent,
      questionMeta
    }
  },
  render() {
    const { isSelected, questionMeta } = this

    const props = {
      isSelected,
      ...this.moduleConfig,
      ...this.$props
    }

    const { BlockComponent } = this
    let dynamicComponent = <span>题型组件加载中</span>
    if (BlockComponent) {
      dynamicComponent = BlockComponent
    }
    return (
      <div class={['question', isSelected ? 'isSelected' : '']}>
        {this.showTitle && <EditTitle {...props} onChange={this.onChange} />}

        <div class="question-block">
          {this.showEditComponent ? (
            <EditOptions
              moduleConfig={props.moduleConfig}
              editConfigure={questionMeta?.editConfigure}
              onChange={this.onChange}
            >
              <dynamicComponent readonly {...props} onBlur={this.onBlur} onFocus={this.onFocus} />
            </EditOptions>
          ) : (
            <dynamicComponent readonly {...props} onBlur={this.onBlur} onFocus={this.onFocus} />
          )}
        </div>
      </div>
    )
  }
})
