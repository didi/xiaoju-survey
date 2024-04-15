import { filterXSS } from '@/common/xss'
import type { Directive, Plugin, DirectiveBinding } from 'vue'

function _safeHtml(el: HTMLElement, binding: DirectiveBinding) {
  const res = filterXSS(binding.value)
  el.innerHTML = res
}

const safeHtml: Directive & Plugin = {
  mounted: _safeHtml,
  updated: _safeHtml,
  install: function (app) {
    app.directive('safe-html', this)
  },
}

export default safeHtml
