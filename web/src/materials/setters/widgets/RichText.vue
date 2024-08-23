<template>
  <RichEditor
    :modelValue="formConfig.value"
    @change="handleEditorValueChange('change', $event)"
    :staticToolBar="true"
    @input="handleEditorValueChange('input', $event)"
  />
</template>

<script setup lang="ts">
import RichEditor from '@/common/Editor/RichEditor.vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

const emit = defineEmits([FORM_CHANGE_EVENT_KEY, 'change', 'input'])
const props = withDefaults(defineProps<Props>(), { formConfig: {} })

const handleEditorValueChange = (eventType: 'change' | 'input', value: string) => {
  const key = props.formConfig.key

  emit(FORM_CHANGE_EVENT_KEY, { key, value })
  emit(eventType, value)
}
</script>
<style lang="scss" scoped>
@import url('@wangeditor/editor/dist/css/style.css');
@import url('@/common/Editor/styles/reset-wangeditor.scss');

.editor-wrapper {
  position: relative;
  width: 100%;
  min-height: 45px;
  border: 1px solid #dedede;
}

.toolbar {
  border-bottom: 1px solid #dedede;
}

.editor {
  padding: 10px;
}
</style>
