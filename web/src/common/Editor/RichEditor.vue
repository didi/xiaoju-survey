<template>
  <div class="editor-wrapper border">
    <div class="toolbar" ref="toolbar" v-show="showToolbar"></div>
    <div class="editor" ref="editor"></div>
  </div>
</template>

<script>
import { createEditor, createToolbar } from '@wangeditor/editor';

export default {
  name: 'richEditor',
  data() {
    return {
      curValue: '',
      editor: null,
      showToolbar: false,
    };
  },
  props: ['value'], // value 用于自定义 v-model
  mounted() {
    this.create();
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        const isEqual = newVal === this.curValue;
        if (isEqual) return; // 和当前内容一样，则忽略

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

      createEditor({
        selector: this.$refs.editor,
        html: this.defaultHtml || this.value || '',
        config: {
          onCreated: (editor) => {
            this.editor = Object.seal(editor);

            if (this.value) {
              this.setHtml(this.value);
            }

            this.$refs.toolbar &&
              createToolbar({
                editor,
                selector: this.$refs.toolbar,
                config: {
                  toolbarKeys: [
                    'color', // 字体色
                    'bgColor', // 背景色
                    'bold',
                    // 'insertImage', // 插入图片
                    // 'video',
                    // 'fontSize', // 字号
                    // 'justify', // 对齐方式
                    'insertLink', // 链接
                    // 'clean',
                  ],
                },
                mode: 'simple',
              });
          },
          onChange: (editor) => {
            const editorHtml = editor.getHtml();
            this.curValue = editorHtml; // 记录当前 html 内容
            this.$emit('input', editorHtml); // 用于自定义 v-model
          },
          onDestroyed: (editor) => {
            this.$emit('onDestroyed', editor);
            editor.destroy();
          },
          onFocus: (editor) => {
            this.$emit('onFocus', editor);
            this.showToolbar = true;
          },
          onBlur: (editor) => {
            const editorHtml = editor.getHtml();
            this.curValue = editorHtml; // 记录当前 html 内容
            this.$emit('change', editorHtml);
            this.$emit('blur', editor);
            this.showToolbar = false;
          },
          // customPaste: (editor, event) => {
          //   let res;
          //   this.$emit('customPaste', editor, event, (val) => {
          //     res = val;
          //   });
          //   return res;
          // },
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
  // min-height: 45px;
}

.toolbar {
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
