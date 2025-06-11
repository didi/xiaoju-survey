import { defineComponent, watch, ref, computed } from 'vue'
import { filterXSS } from '@/common/xss'
import { typeTagLabels } from '@/common/typeEnum.ts'

import './style.scss'

export default defineComponent({
  name: 'TitleContent',
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
  setup(props, { slots }) {
    const status = ref('')
    const moduleTitleRef = ref()
    watch(
      () => props.isSelected,
      () => {
        status.value = 'preview'
      }
    )

    watch(status, (v) => {
      if (v === 'edit') {
        document.addEventListener('click', handleDocumentClick, { capture: true })
      } else {
        document.removeEventListener('click', handleDocumentClick, { capture: true })
      }
    })

    const typeName = computed(() => {
      if (!props.showType) return ''
      const types = props.showType ? [props.type] : []
      if (!types || !types.length) return ''
      let ret = ''
      types.forEach((t) => {
        if (ret) return
        const tv = typeTagLabels && typeTagLabels[t]
        if (tv && typeof tv === 'string') {
          ret = tv.trim()
        }
      })
      return ret
    })

    const tagTitle = computed(() => {
      let htmlText = ''
      htmlText += filterXSS(props.title)
      htmlText = `<span>${htmlText}</span>`
      if (typeName.value) {
        const index = htmlText.lastIndexOf('</p>')
        if (index > -1) {
          htmlText =
            htmlText.slice(0, index) +
            `<span class="m-tag">${typeName.value}</span>` +
            htmlText.slice(index)
        } else {
          htmlText = htmlText + `<span class="m-tag">${typeName.value}</span>`
        }
      }
      return htmlText
    })

    function handleClick(e) {
      if (props.isSelected && status.value === 'preview') {
        e.stopPropagation()
        status.value = 'edit'
      }
    }

    function handleDocumentClick(e) {
      const richEditorDOM = moduleTitleRef.value.querySelector('.rich-editor')
      const isUploadImage = e.target.type === 'file' && e.target.tagName.toLowerCase() === 'input' // 富文本上传图片点击事件触发到input file 元素上了, 该元素插入到body了
      const isClickRichEditor = richEditorDOM?.contains(e.target) || isUploadImage

      if (status.value === 'edit' && richEditorDOM && !isClickRichEditor) {
        // 监听编辑状态时点击非编辑区域
        status.value = 'preview'
      }
    }

    return { slots, handleClick, status, tagTitle, moduleTitleRef }
  },
  render() {
    const { isRequired, indexNumber, slots, status, tagTitle } = this

    return (
      <div
        ref="moduleTitleRef"
        class={['module-title', isRequired ? 'is-required' : '']}
        onClick={this.handleClick}
      >
        {isRequired && <i class="module-title-required">*</i>}
        <div class="module-content">
          {this.showIndex && <span class="index"> {indexNumber}.</span>}
          {status === 'edit' && slots.edit ? (
            slots.edit()
          ) : (
            <div v-html={filterXSS(tagTitle)} class="flex module-text"></div>
          )}
        </div>
      </div>
    )
  }
})
