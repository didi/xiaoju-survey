<template>
  <div class="editor-wrapper">
    <div class="toolbar" ref="toolbar"></div>
    <div class="editor" ref="editor"></div>
  </div>
</template>

<script>
import { createEditor, createToolbar } from '@wangeditor/editor';
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';

export default {
  name: 'RichText',
  data() {
    return {
      curValue: '',
      editor: null,
    };
  },
  props: {
    formConfig: {
      type: Object,
      default: () => ({}),
    },
  }, // value 用于自定义 v-model
  mounted() {
    this.create();
  },
  watch: {
    'formConfig.value': {
      immediate: true,
      handler(newVal) {
        const isEqual = newVal === this.curValue;
        if (isEqual) return; // 和当前内容一样，则忽略
        console.log({
          msg: 'watch',
          newVal,
          curValue: this.curValue,
        });
        this.curValue = newVal;

        // 重置 HTML
        this.setHtml(newVal);
      },
    },
  },
  methods: {
    // 重置 HTML
    setHtml(newHtml) {
      const editor = this.editor;
      if (editor === null) return;
      editor.setHtml(newHtml);
    },

    // 创建 editor
    create() {
      if (this.$refs.editor === null) return;
      console.log('create', this.curValue);
      createEditor({
        selector: this.$refs.editor,
        html: this.curValue || '',
        config: {
          onCreated: (editor) => {
            this.editor = Object.seal(editor);

            if (this.formConfig?.value) {
              this.setHtml(this.formConfig.value);
            }

            createToolbar({
              editor,
              selector: this.$refs.toolbar,
              config: {
                toolbarKeys: [
                  'bold',
                  // 'insertImage', // 插入图片
                  // 'video',
                  // 'fontSize', // 字号
                  'color', // 字体色
                  'bgColor', // 背景色
                  // 'justify', // 对齐方式
                  'insertLink', // 链接
                  // 'clean',
                ],
              },
              mode: 'simple',
            });
          },
          onChange: (editor) => {
            let editorHtml = editor.getHtml();
            if (editorHtml === '<p><br></p>') {
              editorHtml = '';
            }
            this.curValue = editorHtml; // 记录当前 html 内容
            this.$emit(FORM_CHANGE_EVENT_KEY, {
              key: this.formConfig.key,
              value: editorHtml,
            });
            this.$emit('input', editorHtml); // 用于自定义 v-model
          },
          onDestroyed: (editor) => {
            this.$emit('destroyed', editor);
            editor.destroy();
          },
          onFocus: (editor) => {
            this.$emit('focus', editor);
          },
          onBlur: (editor) => {
            this.$emit('blur', editor);
          },
        },
        content: [],
        mode: 'simple',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import url('@wangeditor/editor/dist/css/style.css');
@import url('@/management/styles/reset-wangeditor.scss');

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
