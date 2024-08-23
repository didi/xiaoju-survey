<template>
  <div class="editor-wrapper border">
    <Toolbar
      :class="['toolbar', props.staticToolBar ? 'static-toolbar' : 'dynamic-toolbar']"
      ref="toolbar"
      v-show="showToolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="editor"
      ref="editor"
      :modelValue="curValue"
      :defaultConfig="editorConfig"
      @onCreated="onCreated"
      @onChange="onChange"
      @onBlur="onBlur"
      @onFocus="onFocus"
      :mode="mode"
    />
  </div>
</template>

<script setup>
import { ref, shallowRef, onBeforeMount, watch, computed } from 'vue'
import { get as _get } from 'lodash-es'

import '@wangeditor/editor/dist/css/style.css'
import './styles/reset-wangeditor.scss'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import { useUserStore } from '@/management/stores/user'
import { replacePxWithRem } from './utils'

const emit = defineEmits(['input', 'onFocus', 'change', 'blur', 'created'])
const model = defineModel()
const props = defineProps({
  staticToolBar: { default: false, required: false },
  needUploadImage: { default: false, required: false }
})

const curValue = ref('')
const editorRef = shallowRef()
const showToolbar = ref(props.staticToolBar)

const mode = 'simple'

const toolbarConfig = computed(() => {
  const config = {
    toolbarKeys: [
      'color', // 字体色
      'bgColor', // 背景色
      'bold',
      'insertLink' // 链接
    ]
  }
  if (props.needUploadImage) {
    config.toolbarKeys.push('uploadImage')
  }

  return config
})

const editorConfig = {
  MENU_CONF: {}
}

const userStore = useUserStore()
const token = _get(userStore, 'userInfo.token')

// 图片
editorConfig.MENU_CONF['uploadImage'] = {
  allowedFileTypes: ['image/jpeg', 'image/png'],
  server: '/api/file/upload',
  fieldName: 'file',
  meta: {
    //! 此处的channel需要跟上传接口内配置的channel一致
    channel: 'upload'
  },
  headers: {
    Authorization: `Bearer ${token}`
  },
  customInsert(res, insertFn) {
    const url = res.data.url
    insertFn(url, '', '')
  }
}

const setHtml = (newHtml) => {
  const editor = editorRef.value
  if (editor == null) return
  editor.setHtml(newHtml)
}

const onCreated = (editor) => {
  editorRef.value = editor
  if (model.value) {
    setHtml(model.value)
  }
  emit('created', editor)
}
const onChange = (editor) => {
  const editorHtml = replacePxWithRem(editor.getHtml())

  curValue.value = editorHtml // 记录当前 html 内容
  emit('input', editorHtml) // 用于自定义 v-model
}
const onFocus = (editor) => {
  emit('onFocus', editor)
  setToolbarStatus(true)
}
const onBlur = (editor) => {
  const editorHtml = editor.getHtml()
  curValue.value = editorHtml // 记录当前 html 内容
  emit('change', editorHtml)
  emit('blur', editor)
  setToolbarStatus(false)
}

const setToolbarStatus = (status) => {
  if (props.staticToolBar) return
  showToolbar.value = status
}

watch(
  () => model.value,
  (newVal) => {
    const isEqual = newVal === curValue.value
    if (isEqual) return // 和当前内容一样，则忽略

    // 重置 HTML
    setHtml(newVal)
  },
  {
    // immediate: true
  }
)

onBeforeMount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>
<style lang="scss" scoped>
.editor-wrapper {
  position: relative;
  width: 100%;
  // min-height: 45px;
}

.static-toolbar {
  border-bottom: 1px solid #dedede;
}

.dynamic-toolbar {
  position: absolute;
  left: 0;
  top: -44px;
}

.editor {
  padding: 10px 0;
}

.border {
  border-radius: 2px;

  &:hover {
    box-shadow: 0 0 4px 0 rgb(255 192 62 / 36%);
  }
}
</style>
