import { cleanRichText } from '@/common/xss'
import type { DirectiveBinding, Directive, Plugin } from 'vue'

function _plainText(el: HTMLElement, binding: DirectiveBinding) {
  const text = cleanRichText(binding.value)
  el.innerText = text
}
const plainText: Directive & Plugin = {
  mounted: _plainText,
  updated: _plainText,
  install: function (app) {
    app.directive('plain-text', this)
  },
}

export default plainText
