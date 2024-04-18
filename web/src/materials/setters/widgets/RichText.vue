<template>
  <RichEditor :modelValue="formConfig.value" @change="onChange" :staticToolBar="true" @input="onInput"/>
</template>

<script>
import { createEditor, createToolbar } from '@wangeditor/editor';
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';
import RichEditor from '../../../common/Editor/RichEditor.vue';

export default {
  name: 'RichText',
  components: {
    RichEditor
  },
  props: {
    formConfig: {
      type: Object,
      default: () => ({}),
    },
  }, // value 用于自定义 v-model
  
  methods: {
    onChange(newHtml) {
      this.$emit(FORM_CHANGE_EVENT_KEY, {
              key: this.formConfig.key,
              value: newHtml,
      });
      this.$emit('change', newHtml)
    },
    onInput(newHtml) {
      this.$emit(FORM_CHANGE_EVENT_KEY, {
              key: this.formConfig.key,
              value: newHtml,
      });
      this.$emit('input', newHtml);
    },
  },
};
</script>
<style lang="scss" scoped>
@import url('@wangeditor/editor/dist/css/style.css');
@import url('@/common/styles/reset-wangeditor.scss');

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
