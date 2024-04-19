import { computed, defineComponent, onMounted, ref, shallowRef } from 'vue'
import EditOptions from './EditOptions.jsx';
import moduleTitle from './Title.jsx'
import moduleList from '../common/config/moduleList.js'
import '../common/css/question.scss'

import questionLoader from '@/materials/questions/questionLoader.js'
import '../common/css/title.scss'

export const getBlockComponent = async (type) => {
  const path = moduleList[type]
  const component = await questionLoader.loadComponent(type, path)

  return component
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
  components: {
    moduleTitle
  },
  setup(props, { emit }) {
    const BlockComponent = shallowRef(null)
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
    const onClick = () => {
      emit('select', props.indexNumber)
    }
    return {
      // isSelected,
      props,
      BlockComponent,
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
    
    const { BlockComponent } = this
    let dynamicComponent = <span> 题型组件加载中</span>
    if (BlockComponent){
      dynamicComponent = BlockComponent
    }
    return (
      <div class={['question', isSelected ? 'isSelected' : '']}>
        {this.showTitle && <moduleTitle { ...props } onChange={this.onChange}  />}
        <div class="question-block">
          {
            this.showEditCom ? (
              <EditOptions moduleConfig={props.moduleConfig} >
                <dynamicComponent
                  {...props}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  onChange={this.onChange}
                />
              </EditOptions>
              ) : <dynamicComponent
                    readonly
                    {...props}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    change={this.onChange}
                />
          }
            
        </div>
      </div>
    )
  }
})
