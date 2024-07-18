import { defineComponent } from 'vue'
import { filterXSS } from '@/common/xss'
import RichEditor from '@/common/Editor/RichEditor.vue'

import TitleContent from '../TitleContent'

import './style.scss'

export default defineComponent({
  name: 'EditTitle',
  props: {
    isSelected: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    indexNumber: {
      type: [Number, String],
      default: ''
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '标题'
    },
    showType: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const handleChange = (val) => {
      emit('change', {
        key: 'title',
        value: val
      })
    }
    return {
      handleChange
    }
  },
  render() {
    const { isRequired, indexNumber, title, showType, type, isSelected, showIndex } = this

    return (
      <TitleContent
        isRequired={isRequired}
        indexNumber={indexNumber}
        title={title}
        showType={showType}
        showIndex={showIndex}
        type={type}
        isSelected={isSelected}
      >
        {{
          edit: () => {
            return (
              <RichEditor
                class="rich-editor"
                modelValue={filterXSS(this.title)}
                needUploadImage={true}
                onChange={this.handleChange}
                onCreated={(editor) => {
                  editor?.focus()
                }}
              />
            )
          }
        }}
      </TitleContent>
    )
  }
})
