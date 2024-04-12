import { computed, defineComponent, onMounted, ref, shallowRef } from 'vue'
import moduleTitle from '@/materials/questions/widgets/Title.jsx'
import moduleList from '@/materials/questions/common/config/moduleList.js'
import '@/materials/questions/common/css/question.scss'

import questionLoader from '@/materials/questions/questionLoader.js'
import '@/materials/questions/common/css/title.scss'

export const getBlockComponent = async (type) => {
  const path = moduleList[type]
  const component = await questionLoader.loadComponent(type, path)

  return component
}

export default defineComponent({
  name: 'QuestionContainer',
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
        return {
          field: 'quiestion01',
          type: 'text',
          component: 'InputModule',
          title: '标题1单行输入框',
          value: '123444',
          showType: 'text',
          placeholder: '请填写',
          textRange: {
            max: {
              placeholder: '500',
              value: 500
            },
            min: {
              placeholder: '0',
              value: 0
            }
          },
          valid: 'n'
        }
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
  components: {
    moduleTitle
  },
  setup(props, { emit }) {
    const blockComponent = shallowRef(null)
    const showEditCom = computed(() => {
      let result = false
      if (props.isSelected) {
        if (!['text', 'textarea'].includes(props.type)) {
          result = true
        }
      }
      return result
    })

    // const isSelected = ref(false)
    onMounted(async () => {
      const { component } = await getBlockComponent(props.type)
      blockComponent.value = component
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
      // isSelected,
      blockComponent,
      onClick,
      onBlur,
      onFocus,
      onChange,
      showEditCom
      // showOthers
    }
  },
  render() {
    const { readonly, isSelected } = this

    const props = {
      isSelected,
      ...this.moduleConfig,
      ...this.$props
    }
    const { blockComponent } = this
    return (
      <div class={['question', isSelected ? 'isSelected' : '']}>
        {this.showTitle && <moduleTitle {...{ ...props, props: props }}  />}
        <div class="question-block">
            <blockComponent
              readonly
              {...props}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              change={this.onChange}
            ></blockComponent>
        </div>
      </div>
    )
  }
})
