<template>
  <div class="read-only" :style="getStyle">
    <div v-html="getHtml"></div>
  </div>
</template>
<script>
import { filterXSS } from '@/common/xss';
export default {
  name: 'ReadOnly',
  props: {
    realData: {
      type: String,
      default: () => '',
    },
    viewData: {
      type: String,
      default: () => '',
    },
    tag: {
      tyle: String,
      default: () => '',
    },
    border: {
      tyle: Boolean,
      default: () => false,
    },
    defaultStyle: {
      tyle: Boolean,
      default: () => false,
    },
  },
  data() {
    return {};
  },
  computed: {
    tagHtml() {
      return this.tag
        ? `<span contenteditable="false" style="
            border: 1px solid #fa881a;
            font-size: 0.18rem;
            height: 0.4rem;
            line-height: 0.4rem;
            display: inline-block;
            color: #fa881a;
            padding: 0 0.16rem;
            margin-left: 0.16rem;
            border-radius: 0 0.06rem;
            background: rgba(250,136,26,0.1);
          ">${this.tag}</span>`
        : '';
    },
    getHtml() {
      const title = filterXSS(this.viewData);
      if (!this.tag) return title;
      let html = this.isRichText(title) ? title : `<p>${title}</p>`;
      const index = html.lastIndexOf('</p>');
      if (this.viewData.indexOf(this.tagHtml) < 0) {
        html = html.slice(0, index) + this.tagHtml + html.slice(index);
      }
      return html;
    },
    getStyle() {
      let style = '';
      if (this.border) {
        style += 'border:1px solid #c8c9cd;padding:10px;';
      }
      if (this.defaultStyle) {
        style += 'color: #6e707c;font-size: 12px;';
      }
      return style;
    },
  },
  destroyed() {
    this.$emit('onDestroy');
  },
  methods: {
    isRichText(str) {
      return /^<p[\s\S]*>[\s\S]*<\/p>$/.test(str);
    },
  },
};
</script>
<style lang="scss" scoped>
.read-only {
  width: 100%;
  min-height: 20px;
  padding: 0 10px;
  word-break: break-all;
}
</style>
