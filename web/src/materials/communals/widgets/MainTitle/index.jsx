import { defineComponent, computed, shallowRef, defineAsyncComponent } from 'vue'
import '@/render/styles/variable.scss'
import './index.scss'

export default defineComponent({
  name: 'MainTitle',
  props: {
    bannerConf: {
      type: Object,
      default: () => {}
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
  emits: ['select', 'change'],
  setup(props, { emit }) {
    const titleClass = computed(() => {
      let classStr = ''
      if (!props.readonly) {
        classStr = `main-title ${props.isSelected ? 'active' : ''}`
      } else {
        classStr = 'titlePanel'
      }
      return classStr
    })

    const isTitleHide = computed(() => {
      if (props.readonly && !mainTitle.value) {
        return false
      }
      return true
    })

    const mainTitle = computed(() => {
      return props.bannerConf.titleConfig?.mainTitle
    })

    const handleClick = () => {
      if (props.readonly) return
      emit('select')
    }

    const onTitleInput = (val) => {
      if (!props.isSelected) {
        return
      }
      emit('change', {
        key: 'titleConfig.mainTitle',
        value: val
      })
    }

    const richEditorView = shallowRef(null)
    if (!props.readonly) {
      richEditorView.value = defineAsyncComponent(() => import('@/common/Editor/RichEditor.vue'))
    }

    return {
      props,
      titleClass,
      isTitleHide,
      mainTitle,
      richEditorView,
      handleClick,
      onTitleInput
    }
  },
  render() {
    const { readonly, mainTitle, onTitleInput, richEditorView } = this
    return (
      <div class={['main-title-warp', !readonly ? 'pd15' : '']} onClick={this.handleClick}>
        {this.isTitleHide ? (
          <div class={this.titleClass}>
            {!readonly ? (
              <richEditorView
                modelValue={mainTitle}
                onInput={onTitleInput}
                placeholder="请输入标题"
                class="mainTitle"
              />
            ) : (
              <div class="mainTitle" v-html={mainTitle}></div>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
})
